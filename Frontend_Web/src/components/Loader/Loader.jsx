import PropTypes from "prop-types";
import "./loader.scss";
export default function Loader({ label, color }) {
  return (
    <>
      <div className={`loader ${color} my-4`}>{label}</div>
    </>
  );
}
Loader.propTypes = {
  label: PropTypes.any,
  color: PropTypes.any,
};
