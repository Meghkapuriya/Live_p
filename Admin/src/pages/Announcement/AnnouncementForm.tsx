import React, { useRef, useState, ChangeEvent, FormEvent } from "react";
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

/* ================= TYPES ================= */

interface AnnouncementFormState {
  title: string;
  link: string;
  description: string;
  end_date: string;
  photo: File | null;
}

const AnnouncementForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<AnnouncementFormState>({
    title: "",
    link: "",
    description: "",
    end_date: "",
    photo: null,
  });

  /* ================= INPUT CHANGE ================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= IMAGE CHANGE ================= */

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description || "");
      payload.append("link", formData.link || "");
      payload.append("end_date", formData.end_date);

      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      await api.create("/api/announcements", payload);

      alert("Announcement created successfully ✅");

      /* RESET FORM */
      setFormData({
        title: "",
        link: "",
        description: "",
        end_date: "",
        photo: null,
      });

      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10} lg={11}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <h4 className="mb-4 border-bottom pb-3">Create Announcement</h4>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Title</Label>
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="mb-3">
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
                  </Row>

                  <FormGroup className="mb-3">
                    <Label>Link</Label>
                    <Input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Description</Label>
                    <Input
                      type="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Image (optional)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          innerRef={fileInputRef}
                          onChange={handlePhotoChange}
                        />
                      </FormGroup>
                    </Col>

                    {preview && (
                      <Col md={6} className="text-center">
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
                    )}
                  </Row>

                  <div className="text-end mt-4">
                    <Button color="primary" disabled={loading}>
                      {loading && <Spinner size="sm" className="me-2" />}
                      Publish Announcement
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

export default AnnouncementForm;
