
import Popup from 'reactjs-popup';

const AlertPopup = ({ showAlert, triggerElement, content, popupStyle, otherProps, close, open }) => {
  return (
    <>
      <Popup
        {...otherProps}
        trigger={triggerElement}
        modal
        open={showAlert}
        contentStyle={popupStyle}
        position="right center"
      >
          <div className="flex justify-center items-center gap-6">
            {content}

            <div className="flex justify-between items-center gap-4">
              <button className="bg-white text-blue-400 text-sm rounded-md py-2 px-4 outline-none border-[1px] border-solid border-blue-400" onClick={close}>Cancel</button>
              <button className="bg-blue-400 text-white text-sm rounded-md py-2 px-4 outline-none border-[1px] border-solid border-blue-400" onClick={open}>Ok</button>
            </div>
          </div>
      </Popup>  
    </>
  );
};

export default AlertPopup;
