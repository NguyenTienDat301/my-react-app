import React from "react";
import type { Score } from "../types/interface";
import { useNavigate } from "react-router-dom";

interface ScoreTableProps {
  scores: Score[];

  selectedId: number | null;

  setSelectedId: React.Dispatch<
    React.SetStateAction<number | null>
  >;

  onEdit: (score: Score) => void;

  onDelete: (id: number) => void;
}

const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  selectedId,
  setSelectedId,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  // Tổng điểm
  const totalPoint = (item: Score): number => {
    return (
      item.quanSo +
      item.hocTap +
      item.tacPhong +
      item.kyLuat +
      item.noiVu +
      item.tangGia +
      item.vkTrangBi
    );
  };


  // Điểm trung bình
  const averagePoint = (item: Score): string => {
    return (totalPoint(item) / 7).toFixed(2);
  };


  // Xếp loại
  const rank = (item: Score): string => {
    const total = totalPoint(item);

    if (total >= 58) return "I";

    if (total >= 52) return "II";

    return "III";
  };


  return (
    <section className="center-panel">
      <div className="box">

        <h3>THEO DÕI THI ĐUA</h3>


        <div className="table-wrapper">

          <table className="score-table">

            <thead>
              <tr>
                <th>TT</th>

                <th>Đơn vị</th>

                <th>QS</th>

                <th>HT</th>

                <th>TP</th>

                <th>KL</th>

                <th>NVVS</th>

                <th>TGSX</th>

                <th>VKTB</th>

                <th>Tổng</th>

                <th>TB</th>

                <th>Xếp loại</th>

                <th>Thao tác</th>
              </tr>
            </thead>


            <tbody>

              {scores.length === 0 ? (

                <tr>
                  <td colSpan={13}>
                    Chưa có dữ liệu thi đua
                  </td>
                </tr>

              ) : (

                scores.map((item, index) => (

                  <tr
                    key={item.id}

                    className={
                      selectedId === item.id
                        ? "active-row"
                        : ""
                    }

                    onClick={() => {

                      setSelectedId(item.id);

                      navigate(
                        `/weeks/${item.weekId}/unit/${item.id}`
                      );

                    }}
                  >

                    <td>
                      {index + 1}
                    </td>


                    <td>
                      {item.unit}
                    </td>


                    <td>
                      {item.quanSo}
                    </td>


                    <td>
                      {item.hocTap}
                    </td>


                    <td>
                      {item.tacPhong}
                    </td>


                    <td>
                      {item.kyLuat}
                    </td>


                    <td>
                      {item.noiVu}
                    </td>


                    <td>
                      {item.tangGia}
                    </td>


                    <td>
                      {item.vkTrangBi}
                    </td>


                    <td>
                      <strong>
                        {totalPoint(item)}
                      </strong>
                    </td>


                    <td>
                      {averagePoint(item)}
                    </td>


                    <td>

                      <span
                        className={
                          rank(item) === "I"
                            ? "badge-success"
                            : rank(item) === "II"
                            ? "badge-warning"
                            : "badge-danger"
                        }
                      >

                        {rank(item)}

                      </span>

                    </td>


                    <td>

                      <button
                        className="edit-btn"

                        onClick={(e) => {

                          e.stopPropagation();

                          onEdit(item);

                        }}
                      >
                        Sửa
                      </button>



                      <button
                        className="delete-btn"

                        onClick={(e) => {

                          e.stopPropagation();

                          onDelete(item.id);

                        }}
                      >
                        Xóa
                      </button>

                    </td>


                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
};


export default ScoreTable;