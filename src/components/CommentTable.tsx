import type { CommentItem } from "../types/interface";

interface Props {
  comments: CommentItem[];
}

const CommentTable = ({ comments }: Props) => {
  return (
    <div className="box">
      <h3>NHẬN XÉT</h3>

      <table className="comment-table">
        <thead>
          <tr>
            <th>Đơn vị</th>
            <th>Điểm mạnh</th>
            <th>Điểm yếu</th>
          </tr>
        </thead>

        <tbody>
          {comments.map((item) => (
            <tr key={item.id}>
              <td>{item.unit}</td>

              <td>
                <ul>
                  {item.strong.map((text, index) => (
                    <li key={index}>{text}</li>
                  ))}
                </ul>
              </td>

              <td>
                <ul>
                  {item.weak.map((text, index) => (
                    <li key={index}>{text}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentTable;
