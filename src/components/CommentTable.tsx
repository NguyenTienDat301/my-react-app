import type { CommentItem } from "../types/interface";
import "../styles/commentTable.css";

interface Props {
  comments: CommentItem[];
  /** Số điểm tối đa hiện cho mỗi đơn vị */
  limit?: number;
}

const CommentTable = ({ comments, limit = 2 }: Props) => {
  // Mỗi đơn vị 1 dòng: "Trung đội 1: điểm a; điểm b"
  const renderLines = (type: "strong" | "weak") => {
    const lines = comments
      .map((item) => ({ unit: item.unit, list: item[type].slice(0, limit) }))
      .filter((item) => item.list.length > 0);

    if (lines.length === 0) {
      return <div className="comment-line">&nbsp;</div>;
    }

    return lines.map((item) => (
      <div className="comment-line" key={`${type}-${item.unit}`}>
        <span className="comment-unit-name">{item.unit}:</span>{" "}
        {item.list.join("; ")}
      </div>
    ));
  };

  return (
    <div className="comment-board">
      <h2 className="comment-title">NHẬN XÉT</h2>

      <div className="comment-row">
        <div className="label strong">ĐIỂM MẠNH</div>
        <div className="comment-lines">{renderLines("strong")}</div>
      </div>

      <div className="comment-row">
        <div className="label weak">ĐIỂM YẾU</div>
        <div className="comment-lines">{renderLines("weak")}</div>
      </div>
    </div>
  );
};

export default CommentTable;
