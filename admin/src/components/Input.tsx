import React, { useState } from 'react';
import { TextInput, Button, Flex, Typography } from '@strapi/design-system';
import { ArrowClockwise } from '@strapi/icons';

import {
  useField,
  type InputProps,
  useFetchClient,
  unstable_useContentManagerContext as useContentManagerContext,
  useQueryParams
} from '@strapi/strapi/admin';

type SlugInputProps = InputProps & {
  attribute: {
    type: string;
    options: {
      attachedField: string;
      maxLength: number;
      stripStopwords: boolean;
    };
    customField: string;
    [key: string]: any;
  };
  disabled: boolean;
  label: string;
  name: string;
  mainField?: string;
  placeholder: string;
  required: boolean;
  type: string;
  labelAction?: React.ReactElement;
  onChange: (args: any) => void;
  value: string;
  error?: any;
  rawError?: string;
  hint: string;
  initialValue?: string;
  contentTypeUID: string;
};

type QueryParam = {
  plugins: {
    i18n: {
      locale: string;
    }
  },
}

export const Input = React.forwardRef<HTMLInputElement, SlugInputProps>((props, forwardedRef) => {
  const { attribute, value, error, onChange, hint, disabled, label, name, required } = props;
  const [inputValue, setInputValue] = useState<string>(value ?? '');

  const attachedField = attribute.options?.attachedField;
  const maxLength = attribute.options?.maxLength;
  const removeStopWords = attribute.options?.stripStopwords;
  const targetField = useField(attachedField);
  const { post } = useFetchClient();

  const { model, id } = useContentManagerContext();

  const params = useQueryParams();
  const {plugins} = params?.[0]?.query as QueryParam;
  const locale = plugins?.i18n?.locale;

  const generateSlug = async (): Promise<void> => {
    const targetValue = typeof targetField?.value === 'string' ? targetField.value : '';
    const res = await post('/strapi-plugin-seo-slug/slug/generate', {
      value: targetValue,
      maxLength,
      removeStopWords,
      contentTypeUID: model,
      field: name,
      locale: locale,
      docId: id,
    });

    const slug = res?.data?.slug;
    setInputValue(slug);
    onChange({
      target: {
        name,
        value: slug,
        type: attribute.type,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({
      target: {
        name,
        value: newValue,
        type: attribute.type,
        error
      },
    });
  };

  return (
    <div>
      {label && (
        <Typography variant="pi" fontWeight="bold" textColor="neutral800">
          {/* {formatMessage({
            id: getTranslation("slug.label"),
            defaultMessage: label
          })} */}
          {label}
          {required && <span style={{ color: '#d02b20' }}>*</span>}
        </Typography>
      )}

      <Flex gap={2} alignItems="flex-end" style={{ marginTop: '4px' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            placeholder={props.placeholder}
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            error={error}
            required={required}
            size="M"
          />
        </div>

        <Button
          variant="secondary"
          startIcon={<ArrowClockwise />}
          onClick={generateSlug}
          disabled={disabled}
          type="button"
          size="L"
        >
          Generate
        </Button>
      </Flex>

      {hint && !error && (
        <Typography variant="pi" textColor="neutral600" style={{ marginTop: '4px' }}>
          {hint}
        </Typography>
      )}

      {error && (
        <Typography variant="pi" textColor="danger500" style={{ marginTop: '4px' }}>
          {error}
        </Typography>
      )}
    </div>
  );
});
