import React, { useState, useEffect } from 'react';
import type { danhSach, ScoreField } from '../type/interface';

export const ThiDuaKhenThuong: React.FC = () => {
  // === STATES ===
  const [scores, setScores] = useState<danhSach[]>([]);
  
  // ID hoàn toàn dùng kiểu NUMBER
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<ScoreField>('quanSo');
  const [newScoreInput, setNewScoreInput] = useState<string>('');

  // State cho việc sửa trực tiếp dòng trên bảng
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRowData, setEditRowData] = useState<danhSach | null>(null);

  // State cho Modal/Form thêm đơn vị mới
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUnitName, setNewUnitName] = useState<string>('');

  // States Nhận xét
  const [strongList, setStrongList] = useState<string[]>([
    "Trung đội 1 & 3 duy trì tốt quân số, kết quả học tập và tăng gia sản xuất đạt điểm giỏi.",
    "Công tác quản lý vũ khí trang bị được duy trì chính quy, an toàn tuyệt đối."
  ]);
  const [weakList, setWeakList] = useState<string[]>([
    "Trung đội 2 điểm Nội vụ vệ sinh còn thấp, phong cách làm việc cần chấn chỉnh.",
    "Duy trì chế độ tự học ban tối ở một số tiểu đội chưa nghiêm."
  ]);
  const [inputStrong, setInputStrong] = useState<string>('');
  const [inputWeak, setInputWeak] = useState<string>('');

  // === API FETCH (GET) ===
  useEffect(() => {
    const fetchScores = () => {
      fetch('http://localhost:3001/scores')
        .then((res) => res.json())
        .then((data: danhSach[]) => {
          // Ép kiểu ID về number phòng trường hợp DB cũ chứa string
          const formattedData = data.map((item) => ({
            ...item,
            id: Number(item.id)
          }));
          setScores(formattedData);
          if (formattedData.length > 0) {
            setSelectedUnitId(Number(formattedData[0].id));
          }
        })
        .catch((err) => console.error('Lỗi lấy dữ liệu:', err));
    };

    fetchScores();
  }, []);

  // === XỬ LÝ THÊM ĐƠN VỊ MỚI (POST VỚI ID NUMBER) ===
  const handleAddNewUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;

    // Tạo ID kiểu number (Lấy max ID hiện tại + 1, nếu rỗng thì bắt đầu từ 1)
    const maxId = scores.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    const newId = maxId + 1;

    const newUnit: danhSach = {
      id: newId, // Dữ liệu ID luôn là Number
      unit: newUnitName.trim(),
      quanSo: 15,
      hocTap: 15,
      tacPhong: 15,
      kyLuat: 15,
      noiVu: 15,
      tangGia: 10,
      vkTrangBi: 10
    };

    fetch('http://localhost:3001/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUnit)
    })
      .then((res) => res.json())
      .then((data: danhSach) => {
        const itemWithNumId = { ...data, id: Number(data.id) };
        setScores((prev) => [...prev, itemWithNumId]);
        setNewUnitName('');
        setShowAddModal(false);
      })
      .catch((err) => console.error('Lỗi thêm đơn vị:', err));
  };

  // === XỬ LÝ XÓA ĐƠN VỊ (DELETE) ===
  const handleDeleteUnit = (id: number | string) => {
    const numId = Number(id);
    const targetUnit = scores.find((s) => Number(s.id) === numId);

    const confirmMessage = targetUnit 
      ? `Bạn có chắc chắn muốn xóa đơn vị "${targetUnit.unit}"?` 
      : 'Bạn có chắc chắn muốn xóa đơn vị này?';

    if (!window.confirm(confirmMessage)) return;

    fetch(`http://localhost:3001/scores/${numId}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (res.ok) {
          setScores((prev) => prev.filter((item) => Number(item.id) !== numId));

          if (selectedUnitId === numId) {
            const remaining = scores.filter((item) => Number(item.id) !== numId);
            setSelectedUnitId(remaining.length > 0 ? Number(remaining[0].id) : null);
          }
        } else {
          alert('Không thể xóa đơn vị này!');
        }
      })
      .catch((err) => console.error('Lỗi xóa đơn vị:', err));
  };

  // === XỬ LÝ BẮT ĐẦU SỬA TRÊN BẢNG ===
  const handleStartEdit = (item: danhSach) => {
    if (item.id !== undefined) {
      setEditingId(Number(item.id));
      setEditRowData({ ...item, id: Number(item.id) });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRowData(null);
  };

  // Thay đổi input khi đang sửa dòng
  const handleEditInputChange = (field: keyof danhSach, value: string) => {
    if (!editRowData) return;

    const parsedValue =
      field === 'unit'
        ? value
        : value === '' || isNaN(parseFloat(value))
        ? 0
        : parseFloat(value);

    setEditRowData({
      ...editRowData,
      [field]: parsedValue
    });
  };

  // === LƯU CHỈNH SỬA BẢNG VÀO DATABASE (PUT) ===
  const handleSaveInlineEdit = () => {
    if (!editRowData || editRowData.id === undefined) return;

    const numId = Number(editRowData.id);
    const dataToSend = { ...editRowData, id: numId };

    fetch(`http://localhost:3001/scores/${numId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    })
      .then((res) => res.json())
      .then((updatedItem: danhSach) => {
        const formattedUpdatedItem = { ...updatedItem, id: Number(updatedItem.id) };
        setScores((prev) =>
          prev.map((item) => (Number(item.id) === numId ? formattedUpdatedItem : item))
        );
        setEditingId(null);
        setEditRowData(null);
      })
      .catch((err) => console.error('Lỗi cập nhật dòng:', err));
  };

  // === CẬP NHẬT TỪ FORM CẬP NHẬT NHANH BÊN DƯỚI (PUT) ===
  const handleUpdateScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnitId === null) return;

    const parsedScore = parseFloat(newScoreInput);
    if (isNaN(parsedScore)) return;

    const targetUnit = scores.find((s) => Number(s.id) === selectedUnitId);
    if (!targetUnit) {
      alert("Vui lòng chọn đơn vị hợp lệ!");
      return;
    }

    const updatedUnit = { ...targetUnit, id: Number(targetUnit.id), [selectedField]: parsedScore };

    fetch(`http://localhost:3001/scores/${selectedUnitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUnit)
    })
      .then((res) => res.json())
      .then((data: danhSach) => {
        const formattedData = { ...data, id: Number(data.id) };
        setScores((prev) =>
          prev.map((item) => (Number(item.id) === selectedUnitId ? formattedData : item))
        );
        setNewScoreInput('');
        alert('Cập nhật điểm thành công!');
      })
      .catch((err) => console.error('Lỗi cập nhật điểm:', err));
  };

  // === XỬ LÝ NHẬN XÉT ===
  const handleAddRemark = (type: 'strong' | 'weak') => {
    if (type === 'strong' && inputStrong.trim()) {
      setStrongList([...strongList, inputStrong.trim()]);
      setInputStrong('');
    } else if (type === 'weak' && inputWeak.trim()) {
      setWeakList([...weakList, inputWeak.trim()]);
      setInputWeak('');
    }
  };

  const handleRemoveRemark = (type: 'strong' | 'weak', index: number) => {
    if (type === 'strong') {
      setStrongList(strongList.filter((_, i) => i !== index));
    } else {
      setWeakList(weakList.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span>⭐</span> Bảng Tin Tuần
        </div>
      </header>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>BẢNG CHẤM ĐIỂM THI ĐỦA TUẦN</div>
              <div style={styles.subtitle}>
                Thang điểm tiêu chuẩn: Tổng 100 điểm (Cho phép sửa trực tiếp trên bảng & đồng bộ DB)
              </div>
            </div>
            <div style={styles.btnGroup}>
              <button
                style={{ ...styles.btn, backgroundColor: '#2b6cb0', color: 'white' }}
                onClick={() => setShowAddModal(true)}
              >
                ➕ Thêm Đơn Vị
              </button>
              <button style={{ ...styles.btn, ...styles.btnExcel }}>📊 Xuất Excel</button>
              <button style={{ ...styles.btn, ...styles.btnPdf }}>🖨️ In / PDF</button>
            </div>
          </div>

          {showAddModal && (
            <form onSubmit={handleAddNewUnit} style={styles.addFormBox}>
              <input
                type="text"
                placeholder="Tên đơn vị mới (VD: Trung đội 4)..."
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                style={{ ...styles.formControl, width: '300px' }}
                required
              />
              <button type="submit" style={{ ...styles.btn, backgroundColor: '#276749', color: 'white' }}>
                Lưu Đơn Vị
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ ...styles.btn, backgroundColor: '#718096', color: 'white' }}
              >
                Hủy
              </button>
            </form>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ĐƠN VỊ</th>
                  <th style={styles.th}>QUÂN SỐ</th>
                  <th style={styles.th}>HỌC TẬP</th>
                  <th style={styles.th}>TÁC PHONG</th>
                  <th style={styles.th}>KỶ LUẬT</th>
                  <th style={styles.th}>NỘI VỤ</th>
                  <th style={styles.th}>TĂNG GIA</th>
                  <th style={styles.th}>VKTB</th>
                  <th style={styles.th}>TỔNG ĐIỂM</th>
                  <th style={styles.th}>ĐTB</th>
                  <th style={styles.th}>XẾP LOẠI</th>
                  <th style={styles.th}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((item) => {
                  const isEditing = editingId === Number(item.id);
                  const currentData = isEditing && editRowData ? editRowData : item;

                  const total =
                    Number(currentData.quanSo || 0) +
                    Number(currentData.hocTap || 0) +
                    Number(currentData.tacPhong || 0) +
                    Number(currentData.kyLuat || 0) +
                    Number(currentData.noiVu || 0) +
                    Number(currentData.tangGia || 0) +
                    Number(currentData.vkTrangBi || 0);

                  const dtb = (total / 7).toFixed(2);
                  const isExcellent = total >= 85;

                  return (
                    <tr key={Number(item.id)} style={isEditing ? { backgroundColor: '#f0fff4' } : {}}>
                      <td style={{ ...styles.td, fontWeight: 'bold' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editRowData?.unit || ''}
                            onChange={(e) => handleEditInputChange('unit', e.target.value)}
                            style={styles.inlineInputText}
                          />
                        ) : (
                          item.unit
                        )}
                      </td>

                      {(
                        ['quanSo', 'hocTap', 'tacPhong', 'kyLuat', 'noiVu', 'tangGia', 'vkTrangBi'] as (keyof danhSach)[]
                      ).map((field) => (
                        <td key={field} style={styles.td}>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={
                                editRowData && !isNaN(Number(editRowData[field]))
                                  ? editRowData[field]
                                  : ''
                              }
                              onChange={(e) => handleEditInputChange(field, e.target.value)}
                              style={styles.inlineInput}
                            />
                          ) : (
                            item[field]
                          )}
                        </td>
                      ))}

                      <td style={{ ...styles.td, color: '#276749', fontWeight: 'bold' }}>{total.toFixed(1)}</td>
                      <td style={{ ...styles.td, color: '#2b6cb0', fontWeight: 'bold' }}>{dtb}</td>

                      <td style={styles.td}>
                        <span style={isExcellent ? styles.badgeExcellent : styles.badgeAverage}>
                          {isExcellent ? 'Xuất sắc' : 'Trung bình'}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button onClick={handleSaveInlineEdit} style={styles.btnSaveInline}>
                              💾 Lưu
                            </button>
                            <button onClick={handleCancelEdit} style={styles.btnCancelInline}>
                              ❌
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button onClick={() => handleStartEdit(item)} style={styles.btnEditInline}>
                              ✏️ Sửa
                            </button>
                            <button
                              onClick={() => item.id !== undefined && handleDeleteUnit(item.id)}
                              style={styles.btnDeleteInline}
                              title="Xóa đơn vị này"
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.gridBottom}>
          <div style={styles.card}>
            <div style={{ ...styles.cardTitle, marginBottom: '15px' }}>CẬP NHẬT ĐIỂM NHANH</div>

            <form onSubmit={handleUpdateScore}>
              <div style={styles.formGroup}>
                <label style={styles.label}>ĐƠN VỊ CHỌN</label>
                <select
                  style={styles.formControl}
                  value={selectedUnitId ?? ''}
                  onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                >
                  {scores.map((s) => (
                    <option key={Number(s.id)} value={Number(s.id)}>
                      {s.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>NỘI DUNG CHẤM</label>
                <select
                  style={styles.formControl}
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value as ScoreField)}
                >
                  <option value="quanSo">Quân số</option>
                  <option value="hocTap">Học tập</option>
                  <option value="tacPhong">Tác phong</option>
                  <option value="kyLuat">Kỷ luật</option>
                  <option value="noiVu">Nội vụ vệ sinh</option>
                  <option value="tangGia">Tăng gia SX</option>
                  <option value="vkTrangBi">VK Trang bị</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ĐIỂM SỐ MỚI</label>
                <input
                  type="number"
                  step="0.1"
                  style={styles.formControl}
                  placeholder="Ví dụ 14.5 hoặc 8.25"
                  value={newScoreInput}
                  onChange={(e) => setNewScoreInput(e.target.value)}
                  required
                />
              </div>

              <button type="submit" style={{ ...styles.btn, ...styles.btnSubmit }}>
                LƯU VÀO CƠ SỞ DỮ LIỆU
              </button>
            </form>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.cardTitle, marginBottom: '15px' }}>NHẬN XÉT ĐIỂM MẠNH / ĐIỂM YẾU</div>

            <div style={styles.remarksGrid}>
              <div style={{ ...styles.remarkBox, ...styles.boxStrong }}>
                <div style={{ ...styles.boxTitle, color: '#22543d' }}>💪 ĐIỂM MẠNH:</div>
                <ul style={styles.remarkList}>
                  {strongList.map((text, idx) => (
                    <li key={idx} style={styles.remarkItem}>
                      <span>• {text}</span>
                      <button style={styles.btnDelete} onClick={() => handleRemoveRemark('strong', idx)}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div style={styles.inputInline}>
                  <input
                    type="text"
                    style={styles.formControl}
                    placeholder="Thêm điểm mạnh..."
                    value={inputStrong}
                    onChange={(e) => setInputStrong(e.target.value)}
                  />
                  <button style={{ ...styles.btn, ...styles.btnExcel }} onClick={() => handleAddRemark('strong')}>
                    Thêm
                  </button>
                </div>
              </div>

              <div style={{ ...styles.remarkBox, ...styles.boxWeak }}>
                <div style={{ ...styles.boxTitle, color: '#9b2c2c' }}>⚠️ ĐIỂM YẾU / TỒN TẠI:</div>
                <ul style={styles.remarkList}>
                  {weakList.map((text, idx) => (
                    <li key={idx} style={styles.remarkItem}>
                      <span>• {text}</span>
                      <button style={styles.btnDelete} onClick={() => handleRemoveRemark('weak', idx)}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div style={styles.inputInline}>
                  <input
                    type="text"
                    style={styles.formControl}
                    placeholder="Thêm điểm yếu..."
                    value={inputWeak}
                    onChange={(e) => setInputWeak(e.target.value)}
                  />
                  <button
                    style={{ ...styles.btn, ...styles.btnPdf, backgroundColor: '#c53030' }}
                    onClick={() => handleAddRemark('weak')}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.directionBox}>
              <div style={{ ...styles.boxTitle, color: '#4a5568' }}>📌 PHƯƠNG HƯỚNG NHIỆM VỤ TỚI:</div>
              <div>
                Trung đội 2 tập trung rút kinh nghiệm nội vụ vệ sinh; toàn Đại đội tiếp tục duy trì nghiêm tác phong
                kỷ luật và nâng cao chất lượng huấn luyện.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === STYLES ===
const styles: { [key: string]: React.CSSProperties } = {
  body: {
    backgroundColor: '#edf1eb',
    color: '#2d3748',
    minHeight: '100vh',
    paddingBottom: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
  },
  header: {
    backgroundColor: '#2d5016',
    color: 'white',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold' },
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    borderLeft: '4px solid #2d5016',
    paddingLeft: '10px',
    textTransform: 'uppercase'
  },
  subtitle: { fontSize: '12px', color: '#718096', marginTop: '4px' },
  btnGroup: { display: 'flex', gap: '10px' },
  btn: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer'
  },
  btnExcel: { backgroundColor: '#276749', color: 'white' },
  btnPdf: { backgroundColor: '#2b6cb0', color: 'white' },
  btnSubmit: { backgroundColor: '#2d5016', color: 'white', width: '100%', padding: '12px', marginTop: '15px' },
  addFormBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#ebf8ff',
    borderRadius: '6px',
    border: '1px solid #bee3f8'
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' },
  th: { padding: '12px 6px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#4a5568' },
  td: { padding: '8px 4px', borderBottom: '1px solid #e2e8f0' },
  inlineInput: { width: '50px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #4299e1' },
  inlineInputText: { width: '100px', padding: '4px', borderRadius: '4px', border: '1px solid #4299e1' },
  btnEditInline: {
    padding: '4px 8px',
    fontSize: '11px',
    cursor: 'pointer',
    backgroundColor: '#edf2f7',
    border: '1px solid #cbd5e0',
    borderRadius: '4px'
  },
  btnDeleteInline: {
    padding: '4px 8px',
    fontSize: '11px',
    cursor: 'pointer',
    backgroundColor: '#fff5f5',
    border: '1px solid #feb2b2',
    color: '#c53030',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  btnSaveInline: {
    padding: '4px 8px',
    fontSize: '11px',
    cursor: 'pointer',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  },
  btnCancelInline: {
    padding: '4px 6px',
    fontSize: '11px',
    cursor: 'pointer',
    backgroundColor: '#a0aec0',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  },
  badgeExcellent: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#c6f6d5',
    color: '#22543d'
  },
  badgeAverage: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#fefcbf',
    color: '#744210'
  },
  gridBottom: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#4a5568' },
  formControl: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '5px', fontSize: '13px' },
  remarksGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
  remarkBox: { padding: '12px', borderRadius: '6px', fontSize: '13px' },
  boxStrong: { backgroundColor: '#f0fff4', border: '1px solid #c6f6d5' },
  boxWeak: { backgroundColor: '#fff5f5', border: '1px solid #fed7d7' },
  boxTitle: { fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' },
  remarkList: { listStyle: 'none', padding: 0, margin: 0 },
  remarkItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  btnDelete: { color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  inputInline: { display: 'flex', gap: '6px', marginTop: '10px' },
  directionBox: { backgroundColor: '#f7fafc', padding: '12px', borderRadius: '6px', border: '1px dashed #cbd5e0' }
};

export default ThiDuaKhenThuong;