import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { APIClient, setAuthorization } from "../../helpers/api_helper";

const api = new APIClient();

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    try {
      setLoader(true);
      setError(null);

      // 🔥 COOKIE-BASED OTP VERIFY
      const response: any = await api.create("/api/login/verify-otp", { otp });

      const token = response.token;
      const user = response.admin;

      if (!token) {
        throw new Error("Token missing");
      }

      sessionStorage.setItem("authUser", JSON.stringify({ token, user }));

      setAuthorization(token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err || "Invalid OTP");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <CardBody>
              <h4 className="text-center mb-3">Verify OTP</h4>

              {error && <Alert color="danger">{error}</Alert>}

              <Label>Enter OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 digit OTP"
              />

              <Button
                className="mt-3 w-100"
                color="success"
                disabled={loader}
                onClick={submitOtp}
              >
                {loader && <Spinner size="sm" className="me-2" />}
                Verify OTP
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOtp;
