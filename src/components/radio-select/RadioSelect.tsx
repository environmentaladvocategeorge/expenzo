import React from "react";
import { Controller, Control } from "react-hook-form";
import * as Styled from "./RadioSelect.styles";

interface RadioSelectProps {
  name: string;
  control: Control<any>;
  label: string;
  value: string;
  description?: string;
  isRequired?: boolean;
}

const RadioSelect: React.FC<RadioSelectProps> = ({
  name,
  control,
  label,
  value,
  description,
  isRequired = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired ? `${label} is required` : false,
      }}
      render={({ field, fieldState }) => {
        const Container = fieldState.error
          ? Styled.ErrorContainer
          : field.value === value
          ? Styled.SelectedContainer
          : Styled.Container;

        const handleClick = () => {
          field.onChange(field.value === value ? null : value);
        };

        return (
          <Container onClick={handleClick}>
            <Styled.LabelWrapper>
              <Styled.Radio
                {...field}
                value={value}
                checked={field.value === value}
              />
              <Styled.Label>{label}</Styled.Label>
            </Styled.LabelWrapper>
            {description && (
              <Styled.Description>{description}</Styled.Description>
            )}
          </Container>
        );
      }}
    />
  );
};

export default RadioSelect;
