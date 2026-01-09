import React from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import * as Yup from "yup";
import { useFormik } from "formik";

import { userForgetPassword } from "../../slices/thunks";

import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";

const ForgetPasswordPage = () => {
  const dispatch: any = useDispatch();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      dispatch(userForgetPassword(values));
    },
  });

  const selectLayoutState = (state: any) => state.ForgetPassword;
  const selectData = createSelector(selectLayoutState, (state) => ({
    forgetError: state.forgetError,
    forgetSuccessMsg: state.forgetSuccessMsg,
  }));

  const { forgetError, forgetSuccessMsg } = useSelector(selectData);

  document.title = "Reset Password";

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center">
                    <img src={logoLight} alt="" height="20" />
                    <h5 className="text-primary mt-3">Forgot Password?</h5>
                    <p className="text-muted">
                      Enter your email to receive reset instructions
                    </p>
                  </div>

                  {forgetError && <Alert color="danger">{forgetError}</Alert>}
                  {forgetSuccessMsg && (
                    <Alert color="success">{forgetSuccessMsg}</Alert>
                  )}

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                  >
                    <div className="mb-3">
                      <Label>Email</Label>
                      <Input
                        name="email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email}
                        invalid={
                          !!(
                            validation.touched.email && validation.errors.email
                          )
                        }
                      />
                      <FormFeedback>{validation.errors.email}</FormFeedback>
                    </div>

                    <button className="btn btn-success w-100" type="submit">
                      Send Reset Link
                    </button>
                  </Form>

                  <div className="mt-4 text-center">
                    <Link to="/login">Back to login</Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default ForgetPasswordPage;
