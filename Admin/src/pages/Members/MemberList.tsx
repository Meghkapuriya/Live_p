import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Button,
  Spinner,
} from "reactstrap";

/* ================= TYPES ================= */

interface Member {
  id: number;
  name: string;
  position: string;
  rank?: number | null;
  photo_url?: string | null;
}

const api = new APIClient();

/* ================= COMPONENT ================= */

const MemberList: React.FC = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= LOAD MEMBERS ================= */

  useEffect(() => {
    api
      .get("/api/members")
      .then((res: any) => {
        let list: Member[] = [];

        // ✅ APIClient already returns array
        if (Array.isArray(res)) {
          list = res;
        }
        // ✅ { data: [] }
        else if (Array.isArray(res?.data)) {
          list = res.data;
        }
        // ✅ Laravel pagination { data: { data: [] } }
        else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        }

        setMembers(list);
      })
      .catch(() => {
        alert("Failed to load members ❌");
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      const payload = new FormData();
      payload.append("_method", "DELETE");

      await api.create(`/api/members/${id}`, payload);

      // remove from state
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Delete failed ❌");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading members...</span>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card className="shadow-sm">
              <CardBody>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Members</h4>

                  <Button
                    color="primary"
                    onClick={() => navigate("/members/create")}
                  >
                    + Add Member
                  </Button>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                  <Table className="align-middle table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 80 }}>Rank</th>
                        <th style={{ width: 100 }} className="text-center">
                          Photo
                        </th>
                        <th>Name</th>
                        <th>Position</th>
                        <th style={{ width: 220 }} className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {members.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-muted py-4"
                          >
                            No members found
                          </td>
                        </tr>
                      )}

                      {members.map((m) => (
                        <tr key={m.id}>
                          {/* RANK */}
                          <td>{m.rank ?? "-"}</td>

                          {/* PHOTO */}
                          <td className="text-center">
                            {m.photo_url ? (
                              <img
                                src={m.photo_url}
                                alt={m.name}
                                className="rounded-circle"
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                className="border rounded-circle text-muted d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                              >
                                N/A
                              </div>
                            )}
                          </td>

                          {/* NAME */}
                          <td className="fw-medium">{m.name}</td>

                          {/* POSITION */}
                          <td>{m.position}</td>

                          {/* ACTIONS */}
                          <td className="text-end">
                            <Button
                              size="sm"
                              color="light"
                              className="me-2"
                              onClick={() => navigate(`/members/view/${m.id}`)}
                            >
                              View
                            </Button>

                            <Button
                              size="sm"
                              color="info"
                              className="me-2"
                              onClick={() => navigate(`/members/edit/${m.id}`)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => handleDelete(m.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MemberList;
