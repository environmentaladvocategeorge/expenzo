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
  const [initialTransaction, setInitialTransaction] =
    useState<Transaction | null>(null);
  const { getToken } = useAuth();
  const { getTransactionById, refreshTransactions } = useTransactions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Transaction>();

  const watchedFields = watch();

  useEffect(() => {
    if (transactionId) {
      const fetchedTransaction = getTransactionById(transactionId);
      if (fetchedTransaction) {
        setErrorMessage(null);
        setInitialTransaction(fetchedTransaction);
        reset(fetchedTransaction);
      } else {
        setErrorMessage("Transaction not found");
      }
    } else {
      reset();
      setInitialTransaction(null);
    }
  }, [transactionId, getTransactionById, reset]);

  const deepDiff = (obj1: any, obj2: any): any => {
    const diff: any = {};

    for (const key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (
          typeof obj1[key] === "object" &&
          obj1[key] !== null &&
          !Array.isArray(obj1[key])
        ) {
          const nestedDiff = deepDiff(obj1[key], obj2[key]);
          if (Object.keys(nestedDiff).length > 0) {
            diff[key] = nestedDiff;
          }
        } else if (obj1[key] !== obj2[key]) {
          diff[key] = obj1[key];
        }
      }
    }

    return diff;
  };

  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    try {
      const updatedAttributes = deepDiff(data, initialTransaction);

      if (Object.keys(updatedAttributes).length > 0) {
        await updateTransaction(
          getToken,
          transactionId || "",
          updatedAttributes
        );
        await refreshTransactions();
      }
      onClose();
    } catch {
      setErrorMessage("Failed to update transaction");
    }
  };

  const isSaveDisabled =
    JSON.stringify(watchedFields) === JSON.stringify(initialTransaction);

  return (
    <Modal open={open} onClose={onClose}>
      <Styled.ModalContainer>
        {errorMessage && (
          <Styled.Alert severity="error">{errorMessage}</Styled.Alert>
        )}
        <Styled.ModalTitle variant="h6">Edit Transaction</Styled.ModalTitle>
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
            slotProps={{ input: { readOnly: true } }}
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
            slotProps={{
              input: { readOnly: true },
              htmlInput: { step: "any" },
            }}
          />
          <Styled.TextField
            label="Category"
            fullWidth
            variant="outlined"
            {...register("details.category")}
            error={!!errors.details?.category}
            helperText={errors.details?.category?.message}
          />
          <Styled.SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSaveDisabled}
          >
            Save
          </Styled.SubmitButton>
          <Styled.CloseButton
            variant="outlined"
            color="primary"
            fullWidth
            onClick={onClose}
          >
            Close
          </Styled.CloseButton>
        </form>
      </Styled.ModalContainer>
    </Modal>
  );
};

export default TransactionModal;
