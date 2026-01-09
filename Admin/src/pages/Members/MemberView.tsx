import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
  Button,
} from "reactstrap";

interface Member {
  id: number;
  name: string;
  position: string;
  rank?: number;
  photo_url?: string;
}

const api = new APIClient();

const MemberView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MEMBER (SAME METHOD) ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/members/${id}`)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? null;
        setMember(data);
      })
      .catch(() => {
        alert("Failed to load member ❌");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="page-content text-center mt-5">
        <Spinner />
        <span className="ms-2">Loading member...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="page-content text-center mt-5">Member not found</div>
    );
  }

  /* ================= VIEW ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={8} lg={10}>
            <Card className="shadow-sm">
              <CardBody className="text-center p-4">
                {/* IMAGE */}
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    width={150}
                    height={150}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle border d-flex align-items-center justify-content-center mb-3"
                    style={{ width: 150, height: 150 }}
                  >
                    No Image
                  </div>
                )}

                <h3 className="mb-1">{member.name}</h3>
                <p className="text-muted mb-1">{member.position}</p>
                <p className="fw-semibold">Rank: {member.rank ?? "-"}</p>

                <div className="mt-4">
                  <Button
                    color="secondary"
                    className="me-2"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>

                  <Button
                    color="primary"
                    onClick={() => navigate(`/members/edit/${member.id}`)}
                  >
                    Edit Member
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MemberView;
