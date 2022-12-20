import React, { useEffect, useState } from "react";
import {
  ModalBackdrop,
  FormInputsContainer,
  InputContainer,
} from "../basemodalDesignComponent";
import { Form, Formik, ErrorMessage, Field } from "formik";
import Category from "../Category_AgeLimit";
import { ConfirmModal as ConfirmDiv } from "../../../../pages/adminPages/appointment/components"
import { ToastContainer, toast } from "react-toastify";
function ConfirmModal({ openItem, setOpenItem, body, input = false, inputLength = 0 }) {

  return (
    <ModalBackdrop openItem={{openItem: openItem.isOpen}}>
      <ToastContainer autoClose={1500} />
      <div className="form__modal">
        
        <i
          class="fa-solid fa-xmark closeBtn"
          onClick={() => {
            setOpenItem({
              isOpen: false,
              response: false
            })
          }}
        ></i>
        <h1>
          Notice
        </h1>
        <span style={{
          margin: '30px',
          marginTop: '20px'
        }}>
          {body}
        </span>
          {input}
        
          <ConfirmDiv>
            <button className="complete"  
            onClick={() => {
              if(input) {
                if(inputLength == 0){
                  toast('Please input a proper reason', { type: "error" })
                } else {
                  setOpenItem({
                    isOpen: false,
                    response: true
                  })
                }
                return false
              }
              setOpenItem({
                isOpen: false,
                response: true
              })
            }}>
              Yes
            </button>
            <button className="reject"  onClick={() => setOpenItem({
              isOpen: false,
              response: false
            })}>
              No
            </button>
          </ConfirmDiv>
      
     
        
      </div>
      {/* <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => {
          return (
            <Form className="form__modal" autoComplete="off">
              <i
                class="fa-solid fa-xmark closeBtn"
                onClick={() => setOpenItem(false)}
              ></i>
              <h1>
                Notice
              </h1>

              <FormInputsContainer>
                <label htmlFor={"category"}>Category</label>
                <InputContainer>
                  <Field
                    type="text"
                    name={"category"}
                    id={"category"}
                    placeholder="Category"
                  />
                  <ErrorMessage
                    component={"div"}
                    name={"category"}
                    className="error__message"
                  />
                </InputContainer>
              </FormInputsContainer>

              <button disabled={disabled} type="submit">
                Add Category
              </button>
              <button disabled={disabled} type="submit">
                Add Category
              </button>
              
              
              
            </Form>
          );
        }}
      </Formik> */}
    </ModalBackdrop>
  );
}

export default ConfirmModal;
