import type { CommentItem } from "../types/interface";
import "../styles/commentTable.css";

interface Props {
  comments: CommentItem[];
}

const CommentTable = ({ comments }: Props) => {
  const strong = comments.flatMap((item) => item.strong);
  const weak = comments.flatMap((item) => item.weak);

 

  return (
    <div className="comment-board">
      <h2 className="comment-title">NHẬN XÉT</h2>

      {/* MẠNH */}
      <div className="comment-section">
        <span className="label strong">ĐIỂM MẠNH</span>

        <div className="comment-lines">
          {strong.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          {Array.from({ length: Math.max(0, 5 - strong.length) }).map(
            (_, index) => (
              <p key={`s-${index}`}>&nbsp;</p>
            )
          )}
        </div>
      </div>

      {/* YẾU */}
      <div className="comment-section">
        <span className="label weak">ĐIỂM YẾU</span>

        <div className="comment-lines">
          {weak.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          {Array.from({ length: Math.max(0, 5 - weak.length) }).map(
            (_, index) => (
              <p key={`w-${index}`}>&nbsp;</p>
            )
          )}
        </div>
      </div>




    </div>
  );
};

export default CommentTable;