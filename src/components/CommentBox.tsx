import React from "react";

const CommentBox: React.FC = () => {
  return (
    <div className="comment-box">
      <h3>NHẬN XÉT TRONG TUẦN</h3>

      <textarea
        rows={6}
        placeholder="Nhập nhận xét của đại đội trưởng..."
      />

      <div className="comment-action">
        <button className="save-btn">
          Lưu nhận xét
        </button>
      </div>
    </div>
  );
};

export default CommentBox;