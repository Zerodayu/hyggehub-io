import api from "@/lib/axios";

export async function updateOrgPhoneNo({
    orgId,
    userId,
    phoneNo,
}: {
    orgId: string;
    userId: string;
    phoneNo: string;
}) {
    const res = await api.put(`/org/${orgId}/phone`, {
        userId,
        phoneNo,
    });
    return res.data;
}