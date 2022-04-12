/** @jsx jsx */
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import TextFieldMaterial from '@material-ui/core/TextField';
import { css, jsx } from '@emotion/core';
import { format } from 'date-fns';

const hack = css`
  display: none !important;
`;

const popover = css`
  padding: 15px;

  .popover-label {
    margin-top: 25px;
  }
`;

const dateFormat = d => format(new Date(d), 'MM-DD-YYYY');

const renderValue = value => {
  const [from, to] = value.map(item => {
    if (item) {
      return JSON.parse(item);
    }
    return undefined;
  });
  if (from && to) {
    return `between ${dateFormat(from)} and ${dateFormat(to)}`;
  }
  if (from) {
    return `since ${dateFormat(from)}`;
  }
  if (to) {
    return `before ${dateFormat(to)}`;
  }
  return 'for all dates';
};

const serializeValue = (from, to) => [from, to].map(JSON.stringify);

const parseDate = dateStr => {
  if (dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(+date)) return null;

    date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
    return date;
  }
  return null;
};

const dateFieldFormat = value => {
  if (value == null || Number.isNaN(+value)) return '';
  return format(value, 'YYYY-MM-DD');
};

export default function PublicDateRangeField(props) {
  const { id, from, to, onChange } = props;
  return (
    <Select
      value={serializeValue(from, to)}
      renderValue={renderValue}
      displayEmpty
      multiple
      autoWidth
    >
      <MenuItem css={hack} />
      <div css={popover}>
        <InputLabel id={`${id}-from-label`}>From</InputLabel>
        <TextFieldMaterial
          id={`${id}-from`}
          name={`${id}-from`}
          labelid={`${id}-from-label`}
          type="date"
          value={dateFieldFormat(from)}
          onChange={event => onChange(parseDate(event.target.value), to)}
        />
        <InputLabel className="popover-label" id={`${id}-to-label`}>
          To
        </InputLabel>
        <TextFieldMaterial
          id={`${id}-to`}
          name={`${id}-to`}
          labelid={`${id}-to-label`}
          type="date"
          value={dateFieldFormat(to)}
          onChange={event => {
            onChange(from, parseDate(event.target.value));
          }}
        />
      </div>
    </Select>
  );
}

PublicDateRangeField.propTypes = {
  id: PropTypes.string,
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};
