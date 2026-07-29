import React, { useEffect, useState } from "react";

import type { Soldier } from "../types/interface";

type SoldierForm = Omit<Soldier, "id">;


interface SoldierModalProps {
  open: boolean;

  onClose: () => void;

  onSave: (
    soldier: SoldierForm | Soldier
  ) => void;

  weekId: number;

  unit: string;

  soldier?: Soldier | null;
}



const defaultSoldier = (
  weekId: number,
  unit: string
): SoldierForm => ({
  weekId,

  unit,

  name: "",

  quanSo: 10,

  hocTap: 10,

  tacPhong: 10,

  kyLuat: 10,

  noiVu: 10,

  tangGia: 10,

  vkTrangBi: 10,

  strong: [],

  weak: [],
});



const SoldierModal: React.FC<SoldierModalProps> = ({
  open,
  onClose,
  onSave,
  weekId,
  unit,
  soldier,
}) => {


  const [form, setForm] = useState<SoldierForm>(
    defaultSoldier(weekId, unit)
  );



  useEffect(() => {

    if (!open) return;


    queueMicrotask(() => {

      if (soldier) {

        const data: SoldierForm = {
          weekId: soldier.weekId,

          unit: soldier.unit,

          name: soldier.name,

          quanSo: soldier.quanSo,

          hocTap: soldier.hocTap,

          tacPhong: soldier.tacPhong,

          kyLuat: soldier.kyLuat,

          noiVu: soldier.noiVu,

          tangGia: soldier.tangGia,

          vkTrangBi: soldier.vkTrangBi,

          strong: soldier.strong,

          weak: soldier.weak,
        };


        setForm(data);

      } else {

        setForm(
          defaultSoldier(
            weekId,
            unit
          )
        );

      }

    });


  }, [
    soldier,
    weekId,
    unit,
    open
  ]);




  if (!open) return null;





  const changeScore = (
    key:
      | "quanSo"
      | "hocTap"
      | "tacPhong"
      | "kyLuat"
      | "noiVu"
      | "tangGia"
      | "vkTrangBi",

    value: number

  ) => {

    setForm((prev) => ({
      ...prev,

      [key]: value,
    }));

  };






  return (

    <div className="modal-overlay">


      <div className="modal">


        <h2>
          {
            soldier
              ? "Cập nhật chiến sĩ"
              : "Thêm chiến sĩ"
          }
        </h2>





        {/* Họ tên */}

        <div className="form-group">

          <label>
            Họ tên
          </label>


          <input

            value={form.name}


            onChange={(e) =>
              setForm((prev) => ({
                ...prev,

                name: e.target.value,
              }))
            }

          />

        </div>






        {/* Điểm thi đua */}


        {[
          {
            label: "Quân số",
            key: "quanSo",
          },

          {
            label: "Học tập",
            key: "hocTap",
          },

          {
            label: "Tác phong",
            key: "tacPhong",
          },

          {
            label: "Kỷ luật",
            key: "kyLuat",
          },

          {
            label: "Nội vụ",
            key: "noiVu",
          },

          {
            label: "Tăng gia",
            key: "tangGia",
          },

          {
            label: "VKTB",
            key: "vkTrangBi",
          },

        ].map((item) => (


          <div
            className="form-group"
            key={item.key}
          >


            <label>
              {item.label}
            </label>



            <input

              type="number"

              min={0}

              max={10}


              value={
                form[
                  item.key as keyof SoldierForm
                ] as number
              }


              onChange={(e) =>

                changeScore(

                  item.key as
                    | "quanSo"
                    | "hocTap"
                    | "tacPhong"
                    | "kyLuat"
                    | "noiVu"
                    | "tangGia"
                    | "vkTrangBi",

                  Number(e.target.value)

                )

              }

            />


          </div>


        ))}






        {/* Điểm mạnh */}

        <div className="form-group">


          <label>
            Điểm mạnh
          </label>


          <textarea

            rows={5}


            value={
              form.strong.join("\n")
            }


            onChange={(e) =>

              setForm((prev) => ({

                ...prev,


                strong:
                  e.target.value
                    .split("\n")
                    .filter(
                      (x) =>
                        x.trim() !== ""
                    ),

              }))

            }

          />


        </div>






        {/* Điểm yếu */}

        <div className="form-group">


          <label>
            Điểm yếu
          </label>



          <textarea

            rows={5}


            value={
              form.weak.join("\n")
            }


            onChange={(e) =>

              setForm((prev) => ({

                ...prev,


                weak:
                  e.target.value
                    .split("\n")
                    .filter(
                      (x) =>
                        x.trim() !== ""
                    ),

              }))

            }

          />


        </div>






        {/* Button */}


        <div className="modal-actions">


          <button

            className="save-btn"


            onClick={() => {


              if (!form.name.trim()) {

                alert(
                  "Vui lòng nhập tên chiến sĩ"
                );

                return;

              }


              onSave(form);


            }}

          >

            💾 Lưu

          </button>





          <button

            className="cancel-btn"

            onClick={onClose}

          >

            ❌ Hủy

          </button>



        </div>




      </div>


    </div>

  );

};



export default SoldierModal;