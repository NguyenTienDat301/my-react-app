import type { CommentItem } from "../types/interface";
import "../styles/commentTable.css";

interface Props {
  comments: CommentItem[];
  limit?: number;
}

const CommentTable = ({ comments, limit = 6 }: Props) => {
  // Điểm mạnh: chỉ lấy của đơn vị đầu tiên
  const strongValues = comments[0]?.strong.slice(0, limit) ?? [];

  // Điểm yếu: giữ nguyên theo đơn vị
  const weakValues = comments
    .map((item) => ({
      unit: item.unit,
      weak: item.weak.slice(0, limit),
    }))
    .filter((item) => item.weak.length > 0);

  return (
    <div className="comment-board">
      <h2 className="comment-title">NHẬN XÉT</h2>

      {/* ================= ĐIỂM MẠNH ================= */}
      <div className="comment-row">
        <div className="label strong">ĐIỂM MẠNH</div>

        <div className="comment-lines">
          {strongValues.length > 0 ? (
            strongValues.map((text, index) => (
              <div className="strong-line" key={index}>
                {text}
              </div>
            ))
          ) : (
            <div className="strong-line">&nbsp;</div>
          )}
        </div>
      </div>

      {/* ================= ĐIỂM YẾU ================= */}
      <div className="comment-row">
        <div className="label weak">ĐIỂM YẾU</div>

        <div className="comment-lines">
          {weakValues.length > 0 ? (
            weakValues.flatMap((item) =>
              item.weak.map((text, index) => (
                <div className="weak-line" key={`${item.unit}-${index}`}>
                  <div className="weak-unit">
                    {index === 0 ? `${item.unit}:` : ""}
                  </div>

                  <div className="weak-text">{text}</div>
                </div>
              ))
            )
          ) : (
            <div className="weak-line">
              <div className="weak-unit"></div>
              <div className="weak-text">&nbsp;</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentTable;