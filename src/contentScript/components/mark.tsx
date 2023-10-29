import React, { useState, useEffect, useReducer, useRef } from "react";
import { BUTTON_BOTTOM, ISDEBUG } from "../../core/constants";
import Draggable from "react-draggable";
import { getURL } from "../../core/common";
export const DraggableComponent = ({ onClick = () => {}, isHide = false }) => {
  const [prevPos, setPrevPos] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [bottomPosition, setBottomPosition] = useState(0);
  const [clickable, setClickable] = useState(true);
  const [show, setShow] = useState(false);
  const rightIcon = useRef(null);

  useEffect(() => {
    const bottomPos = JSON.parse(localStorage.getItem("buttonBottom"));
    if (bottomPos) {
      setBottomPosition(parseInt(bottomPos));
      setTimeout(() => {
        setShow(true);
      }, 1500);
      //   if (rightIcon) {
      //     rightIcon.current.style.transition = "transform 500ms";
      //     rightIcon.current.style.transform = "translate(40px, 0px)";
      //     setTimeout(() => {
      //       rightIcon.current.style.transform = "translate(0px, 0px)";
      //       //   setShow(true);
      //     }, 500);
      //   }
    } else {
      setBottomPosition(BUTTON_BOTTOM);
      localStorage.setItem("buttonBottom", JSON.stringify(BUTTON_BOTTOM));
      setTimeout(() => {
        setShow(true);
      }, 1500);
      //   if (rightIcon) {
      //     rightIcon.current.style.transition = "transform 500ms";
      //     rightIcon.current.style.transform = "translate(40px, 0px)";
      //     setTimeout(() => {
      //       rightIcon.current.style.transform = "translate(0px, 0px)";
      //       //   setShow(true);
      //     }, 1000);
      //   }
      // setTimeout(()=>{
      //     setShow(true);
      // }, 1500);
    }
  }, []);

  const clickRightIcon = () => {
    onClick();
  };

  useEffect(() => {
    if (rightIcon) {
      let transy = parseInt(
        rightIcon.current.style.transform.split(",")[1].split("px")[0]
      );
      rightIcon.current.style.transform = `translate(${
        isHide ? 40 : 0
      }px, ${transy}px)`;
    }
  }, [isHide]);

  const onDragStartListener = (e, data) => {
    rightIcon.current.style.transition = "";
    setPrevPos({ x: e.clientX, y: e.clientY });
    setClickable(false);
  };
  const onDragStopListener = (e, data) => {
    if (prevPos.x == e.clientX && prevPos.y == e.clientY) {
      setClickable(true);
      rightIcon.current.style.transition = "transform 500ms";
    } else {
      const bottomPos = JSON.parse(localStorage.getItem("buttonBottom"))
        ? JSON.parse(localStorage.getItem("buttonBottom"))
        : 0;
      localStorage.setItem(
        "buttonBottom",
        (parseInt(bottomPos) - e.clientY + prevPos.y).toString()
      );
      setTimeout(() => {
        setClickable(true);
        rightIcon.current.style.transition = "transform 500ms";
      }, 500);
    }
  };
  return (
    <Draggable
      axis="y"
      onStart={onDragStartListener}
      onStop={onDragStopListener}
    >
      <div
        ref={rightIcon}
        id="discount-button"
        style={{
          bottom: bottomPosition,
          right: "-25px !important",
          display: show ? "" : "none",
          transition: "transform 500ms",
        }}
      >
        <div className="close-rect">
          {/* <span className="close" onClick={()=>console.log('close button')} ></span> */}
          <div
            id="discount-button-hide"
            style={{ width: 35, height: 35 }}
            onClick={() => clickable && clickRightIcon()}
          />
        </div>
        <div
          id="draggable-button"
          onClick={clickRightIcon}
          style={{
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={
                "data:image/png;base64,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"
              }
              draggable={false}
              style={{ width: 25, height: 25 }}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};
