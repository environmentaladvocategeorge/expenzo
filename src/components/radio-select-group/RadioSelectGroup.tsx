import React from "react";
import { Controller, Control } from "react-hook-form";
import * as Styled from "./RadioSelectGroup.styles";
import RadioSelect from "../radio-select/RadioSelect";

interface RadioSelectGroupProps {
  name: string;
  control: Control<any>;
  values: { label: string; value: string; description?: string }[];
  isRequired?: boolean;
}

const RadioSelectGroup: React.FC<RadioSelectGroupProps> = ({
  name,
  control,
  values,
  isRequired = false,
}) => {
  return (
    <Styled.RadioSelectGroupContainer>
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? `You must select an option` : false,
        }}
        render={({ fieldState }) => (
          <>
            {values.map((item) => (
              <RadioSelect
                key={item.value}
                name={name}
                control={control}
                label={item.label}
                value={item.value}
                isRequired={false}
                description={item.description}
              />
            ))}
            {fieldState.error && (
              <Styled.ErrorText>{fieldState.error.message}</Styled.ErrorText>
            )}
          </>
        )}
      />
    </Styled.RadioSelectGroupContainer>
  );
};

export default RadioSelectGroup;
