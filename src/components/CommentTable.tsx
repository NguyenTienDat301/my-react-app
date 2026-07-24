import React from "react";
import type { Score } from "../types/interface";

interface Props {
  scores: Score[];
}

const CommentTable: React.FC<Props> = ({ scores }) => {
  return (
    <div className="box">

      <h3>NHẬN XÉT</h3>

      <table className="comment-table">

        <thead>
          <tr>
            <th style={{ width: "18%" }}>Đơn vị</th>
            <th>Điểm mạnh</th>
            <th>Điểm yếu</th>
          </tr>
        </thead>

        <tbody>

          {scores.map((item) => (

            <tr key={item.id}>

              <td>
                <strong>{item.unit}</strong>
              </td>

              <td>
                <textarea
                  placeholder="Nhập điểm mạnh..."
                  rows={3}
                />
              </td>

              <td>
                <textarea
                  placeholder="Nhập điểm yếu..."
                  rows={3}
                />
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default CommentTable;