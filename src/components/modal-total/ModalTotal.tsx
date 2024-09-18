"use client";

import classes from "./ModalTotal.module.css";
import { Incomes, Place } from "../../interfaces";
import { CircleX } from "lucide-react";
import { calculateTotalIncome } from "../../utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getIncomes, registerIncome } from "../../api/request";
import toast from "react-hot-toast";

interface Props {
  visibleModal: boolean;
  onClose: () => void;
  places?: Place[];
}

const ModalTotal = ({ visibleModal, onClose, places }: Props) => {
  const { data } = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
  });

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const handleFormClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const mutation = useMutation({
    mutationFn: registerIncome,
  });

  const handleSubmit = () => {
    if (places?.length && calculateTotalIncome(places)) {
      mutation.mutate({
        date: new Date(),
        total: calculateTotalIncome(places) + "",
      });
    } else {
      toast.error("No hay ingresos");
    }
  };

  const totalIncome = (incomes?: Incomes[]) => {
    let total = 0;
    if (incomes) {
      for (let i of incomes) {
        total += Number(i.total);
      }
    }
    return total;
  };

  return (
    visibleModal && (
      <section
        className={classes["container-modal"]}
        onClick={handleContainerClick}
      >
        <div className={classes.form} onClick={handleFormClick}>
          <CircleX
            className={classes["icon-close"]}
            onClick={() => {
              onClose();
            }}
          />
          <h1>Ingresos totales</h1>
          <span>${totalIncome(data)}</span>

          <p>Ingresos del día</p>
          <span>${places?.length ? calculateTotalIncome(places) : "0"}</span>
          <button className={classes["button-income"]} onClick={handleSubmit}>
            Cerrar el día
          </button>
        </div>
      </section>
    )
  );
};

export default ModalTotal;
