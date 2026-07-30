import type { CommentItem } from "../types/interface";
import "../styles/commentTable.css";

interface Props {
  comments: CommentItem[];
}

const CommentTable = ({ comments }: Props) => {
  const strong = comments.flatMap((item) => item.strong);
  const weak = comments.flatMap((item) => item.weak);

  const renderLines = (data: string[], key: string) => (
    <>
      {data.map((text, index) => (
        <div className="comment-line" key={`${key}-${index}`}>
          {text}
        </div>
      ))}

      {Array.from({ length: Math.max(0, 5 - data.length) }).map(
        (_, index) => (
          <div className="comment-line" key={`${key}-empty-${index}`}>
            &nbsp;
          </div>
        )
      )}
    </>
  );

  return (
    <div className="comment-board">
      <h2 className="comment-title">NHẬN XÉT</h2>

      <div className="comment-row">
        <div className="label strong">ĐIỂM MẠNH</div>

        <div className="comment-lines">
          {renderLines(strong, "strong")}
        </div>
      </div>


      <div className="comment-row">
        <div className="label weak">ĐIỂM YẾU</div>

        <div className="comment-lines">
          {renderLines(weak, "weak")}
        </div>
      </div>

    </div>
  );
};

export default CommentTable;