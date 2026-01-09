import React, { useRef, useState } from "react";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Spinner,
} from "reactstrap";

const api = new APIClient();

const EventForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    end_date: "",
    status: "",
    photo: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("link", formData.link);
      payload.append("description", formData.description);
      payload.append("end_date", formData.end_date);

      if (formData.status) payload.append("status", formData.status);
      if (formData.photo) payload.append("photo", formData.photo);

      // ✅ CORRECT API CALL (NO /api here)
      await api.create("/api/events", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event created successfully");

      setFormData({
        title: "",
        link: "",
        description: "",
        end_date: "",
        status: "",
        photo: null,
      });

      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={12} lg={11}>
            <Card className="shadow-sm">
              <CardBody>
                <h4 className="mb-5 text-center border-bottom pb-3">
                  Event Form
                </h4>

                <Form onSubmit={handleSubmit}>
                  {/* ROW 1 */}
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Title</Label>
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Event Link</Label>
                        <Input
                          type="url"
                          name="link"
                          value={formData.link}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Status</Label>
                        <Input
                          type="select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="">Auto (Recommended)</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="recent">Recent</option>
                          <option value="past">Past</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ROW 2 */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Event Image</Label>
                        <Input
                          innerRef={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ROW 3 */}
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label>Description</Label>
                        <Input
                          type="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* IMAGE PREVIEW */}
                  {preview && (
                    <Row className="mb-3">
                      <Col className="text-center">
                        <img
                          src={preview}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{
                            width: 180,
                            height: 180,
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                    </Row>
                  )}

                  {/* SUBMIT */}
                  <div className="text-center mt-4">
                    <Button color="primary" disabled={loading}>
                      {loading && <Spinner size="sm" className="me-2" />}
                      Publish Event
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EventForm;
