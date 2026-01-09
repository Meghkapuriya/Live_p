import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface Member {
  id: number;
  name: string;
  position: string;
  rank?: number;
  photo_url?: string;
}

const api = new APIClient();

const EditMember: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    rank: "",
    photo: null as File | null,
  });

  /* ================= LOAD MEMBER ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/members/${id}`)
      .then((res: any) => {
        const m: Member = res?.data?.data ?? res?.data;

        setFormData({
          name: m.name || "",
          position: m.position || "",
          rank: m.rank ? String(m.rank) : "",
          photo: null,
        });

        setPreview(m.photo_url || null);
      })
      .catch(() => alert("Failed to load member ❌"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((p) => ({ ...p, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("position", formData.position);
      payload.append("rank", formData.rank);
      payload.append("_method", "PUT");

      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      await api.create(`/api/members/${id}`, payload);

      alert("Member updated successfully ✅");
      navigate("/members/list");
    } catch {
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content text-center mt-5">
        <Spinner /> <span className="ms-2">Loading member...</span>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={8}>
            <Card>
              <CardBody>
                <h4 className="mb-4">Edit Member</h4>

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Position</Label>
                    <Input
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Rank</Label>
                    <Input
                      type="number"
                      name="rank"
                      value={formData.rank}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Photo</Label>
                    <Input
                      type="file"
                      innerRef={fileRef}
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-3 rounded"
                        style={{ width: 120, height: 120, objectFit: "cover" }}
                      />
                    )}
                  </FormGroup>

                  <div className="text-end">
                    <Button
                      color="secondary"
                      className="me-2"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" disabled={saving}>
                      {saving ? "Updating..." : "Update Member"}
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

export default EditMember;
