import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTransactions } from "@/contexts/TransactionsContext";
import * as Styled from "./TransactionModal.styles";
import { Transaction } from "@/types/api";
import { updateTransaction } from "@/services/transactionService";
import { useAuth } from "@/contexts/AuthenticationContext";

const TransactionModal = ({
  open,
  onClose,
  transactionId,
}: {
  open: boolean;
  onClose: () => void;
  transactionId?: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const { getToken } = useAuth();

  const { getTransactionById, refreshTransactions } = useTransactions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Transaction>();

  useEffect(() => {
    if (transactionId) {
      const fetchedTransaction = getTransactionById(transactionId);
      if (fetchedTransaction) {
        setTransaction(fetchedTransaction);
      } else {
        setErrorMessage("Transaction not found");
      }
    }
  }, [transactionId, getTransactionById]);

  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    console.log(data);
    await updateTransaction(getToken, transactionId || "");
    await refreshTransactions();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Styled.ModalContainer>
        {errorMessage && (
          <Styled.Alert severity="error">{errorMessage}</Styled.Alert>
        )}
        <Styled.ModalTitle variant="h6">Transaction</Styled.ModalTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.TextField
            label="ID"
            fullWidth
            variant="outlined"
            value={transactionId || ""}
            slotProps={{ input: { readOnly: true } }}
          />
          <Styled.TextField
            label="Date"
            fullWidth
            variant="outlined"
            type="date"
            {...register("date", { required: "Date is required" })}
            error={!!errors.date}
            helperText={errors.date?.message}
            defaultValue={transaction?.date}
          />
          <Styled.TextField
            label="Description"
            fullWidth
            variant="outlined"
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            defaultValue={transaction?.description}
            multiline
          />
          <Styled.TextField
            label="Amount"
            fullWidth
            variant="outlined"
            type="number"
            {...register("amount", { required: "Amount is required" })}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            defaultValue={transaction?.amount}
          />
          <Styled.TextField
            label="Category"
            fullWidth
            variant="outlined"
            error={!!errors.details?.category}
            helperText={errors.details?.category?.message}
            defaultValue={transaction?.details?.category}
          />
          <Styled.SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            EDIT
          </Styled.SubmitButton>
          <Styled.CloseButton
            variant="outlined"
            color="primary"
            fullWidth
            onClick={onClose}
          >
            CLOSE
          </Styled.CloseButton>
        </form>
      </Styled.ModalContainer>
    </Modal>
  );
};

export default TransactionModal;
