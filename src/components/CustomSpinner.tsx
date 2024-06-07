import {Spinner} from "@nextui-org/react";

const CustomSpinner = ({message}:any) => {
  return (
    <Spinner label={message}  size="lg" className='m-10' color='primary'/>
  );
};

export default CustomSpinner;