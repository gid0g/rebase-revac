import styled from "styled-components";
import { FiSearch, FiX } from "react-icons/fi";

const TextField = styled.input`
  height: 32px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  &:hover {
    cursor: pointer;
  }
`;
export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    // fill: #ccc;
  }

  &:hover {
    svg {
      // fill: #000;
    }
  }
`;
export const InputContainer = styled.div`
  position: relative;
  width: 250px;
`;


export default TextField;
