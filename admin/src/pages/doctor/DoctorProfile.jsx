import { useEffect, useState } from "react";
import axios from "axios"; 
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEdit,setIsEdit] = useState(false);
  const [docFee, setDocFee] = useState(0);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [docAvailable, setDocAvailable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError("");
        const doctorToken = localStorage.getItem("Doctortoken");

        if (!doctorToken) {
          setError("Doctor token not found. Please login again.");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:5000/api/doctor/currentDoc",
          {
            headers: { token: doctorToken },
          }
        );

        if (data?.success) {
          setDoctor(data.user);
          setDocFee(data.user.DocFee || 0);
          setLine1(data.user.Docaddress?.line1 || "");
          setLine2(data.user.Docaddress?.line2 || "");
          setDocAvailable(Boolean(data.user.DocAvailable));
          setImagePreview(data.user.DocImage || "");
        } else {
          setError(data?.message || "Unable to fetch profile.");
        }
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleSaveProfile = async () => {
    if (!doctor?._id) {
      toast.error("Doctor data not found");
      return;
    }

    try {
      setIsSaving(true);
      const doctorToken = localStorage.getItem("Doctortoken");
      const payload = new FormData();
      payload.append("docId", doctor._id);
      payload.append("DocFee", Number(docFee));
      payload.append("Docaddress", JSON.stringify({ line1, line2 }));
      payload.append("DocAvailable", docAvailable);

      if (imageFile) {
        payload.append("DocImage", imageFile);
      }

      const { data } = await axios.put(
        "http://localhost:5000/api/doctor/update-profile",
        payload,
        { headers: { token: doctorToken } }
      );

      if (data?.success) {
        setDoctor((prev) => ({
          ...prev,
          ...(data.user || {}),
          DocFee: Number(docFee),
          Docaddress: { line1, line2 },
          DocAvailable: docAvailable,
          DocImage: data?.user?.DocImage || imagePreview || prev.DocImage,
        }));
        setImageFile(null);
        setIsEdit(false);
        toast.success(data.message || "Profile updated");
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (apiError) {
      toast.error(apiError?.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] px-4 py-7 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-primary">
            Doctor Panel
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-800 sm:text-4xl">
            My Profile
          </h1>
        </div>

        {loading && (
          <div className="mt-5 rounded-xl border border-[#CDD2FF] bg-[#F2F3FF] px-4 py-3 text-sm font-semibold text-[#3D47AA]">
            Loading profile...
          </div>
        )}

        {!loading && error && (
          <div className="mt-5 rounded-xl border border-[#F1B4B4] bg-[#FFF3F3] px-4 py-3 text-sm font-semibold text-[#991B1B]">
            {error}
          </div>
        )}

        {!loading && !error && doctor && (
          <div className="mt-5 overflow-hidden rounded-3xl border border-[#E4E8FF] bg-white shadow-[0_12px_30px_rgba(95,111,255,0.09)]">
            <div className="grid grid-cols-1 items-center gap-5 border-b border-[#ECEFFF] p-4 sm:p-6 md:grid-cols-[auto_1fr_auto]">
              {isEdit ? (
                <label className="justify-self-center cursor-pointer md:justify-self-auto">
                  <img
                    className="h-24 w-24 rounded-2xl border-[3px] border-[#D9DDFF] object-cover sm:h-28 sm:w-28"
                    src={imagePreview || doctor.DocImage}
                    alt={doctor.DocName}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                  <p className="mt-1 text-center text-xs text-primary">Change photo</p>
                </label>
              ) : (
                <img
                  className="h-24 w-24 justify-self-center rounded-2xl border-[3px] border-[#D9DDFF] object-cover sm:h-28 sm:w-28 md:justify-self-auto"
                  src={doctor.DocImage}
                  alt={doctor.DocName}
                />
              )}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold leading-tight text-gray-800">
                  {doctor.DocName}
                </h2>
                <p className="mt-1 font-semibold text-primary">
                  {doctor.DocSpecility}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full border border-[#DCE1FF] bg-[#F2F3FF] px-3 py-1.5 text-xs font-semibold text-[#4F46B5]">
                    {doctor.DocExperience} experience
                  </span>
                  <span className="rounded-full border border-[#DCE1FF] bg-[#F2F3FF] px-3 py-1.5 text-xs font-semibold text-[#4F46B5]">
                    {isEdit ? (
                      <span className="inline-flex items-center gap-1">
                        <span>Fee:</span>
                        <input
                          type="number"
                          className="w-20 rounded bg-white px-2 py-0.5 text-xs outline-none"
                          value={docFee}
                          onChange={(e) => setDocFee(e.target.value)}
                        />
                      </span>
                    ) : (
                      <>Consultation Fee: ${doctor.DocFee}</>
                    )}
                  </span>
                  <span className="rounded-full border border-[#DCE1FF] bg-[#F2F3FF] px-3 py-1.5 text-xs font-semibold text-[#4F46B5]">
                    {doctor.DocEmail}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-self-center md:items-end md:justify-self-end">
                <span
                  className={`inline-block rounded-full border px-3.5 py-2 text-xs font-extrabold tracking-[0.02em] md:justify-self-end ${
                    doctor.DocAvailable
                      ? "border-[#CCD2FF] bg-[#F2F3FF] text-[#3F4BA8]"
                      : "border-[#FFC8D8] bg-[#FFEEF4] text-[#9F1239]"
                  }`}
                >
                  {doctor.DocAvailable ? "Available" : "Unavailable"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (isEdit) {
                      handleSaveProfile();
                    } else {
                      setIsEdit(true);
                    }
                  }}
                  disabled={isSaving}
                  className="rounded-full border border-primary bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4E5DE6]"
                >
                  {isSaving ? "Saving..." : isEdit ? "Save Profile" : "Edit Profile"}
                </button>
                {isEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEdit(false);
                      setDocFee(doctor.DocFee || 0);
                      setLine1(doctor.Docaddress?.line1 || "");
                      setLine2(doctor.Docaddress?.line2 || "");
                      setDocAvailable(Boolean(doctor.DocAvailable));
                      setImageFile(null);
                      setImagePreview(doctor.DocImage || "");
                    }}
                    className="rounded-full border border-[#DCE1FF] bg-white px-4 py-2 text-xs font-semibold text-[#515151] transition-colors hover:bg-[#F8F9FD]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:p-5 md:grid-cols-2">
              <section className="rounded-2xl border border-[#EDF0FF] bg-[#FBFCFF] p-4">
                <h3 className="mb-2 text-base font-semibold text-gray-700">About</h3>
                <p className="m-0 leading-7 text-[#515151]">
                  {doctor.Docabout || "No description available."}
                </p>
              </section>

              <section className="rounded-2xl border border-[#EDF0FF] bg-[#FBFCFF] p-4">
                <h3 className="mb-2 text-base font-semibold text-gray-700">
                  Education
                </h3>
                <p className="m-0 leading-7 text-[#515151]">
                  {doctor.DocEducation || "Education details not added."}
                </p>
              </section>

              <section className="rounded-2xl border border-[#EDF0FF] bg-[#FBFCFF] p-4 md:col-span-2">
                <h3 className="mb-2 text-base font-semibold text-gray-700">Address</h3>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      className="w-full rounded-lg border border-[#DCE1FF] px-3 py-2 text-sm outline-none"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="Address line 1"
                    />
                    <input
                      className="w-full rounded-lg border border-[#DCE1FF] px-3 py-2 text-sm outline-none"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      placeholder="Address line 2"
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-[#515151]">
                      <input
                        type="checkbox"
                        checked={docAvailable}
                        onChange={(e) => setDocAvailable(e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      Available for appointments
                    </label>
                  </div>
                ) : (
                  <>
                    <p className="m-0 leading-7 text-[#515151]">
                      {doctor.Docaddress?.line1 || "Address line 1 not available"}
                    </p>
                    <p className="m-0 leading-7 text-[#515151]">
                      {doctor.Docaddress?.line2 || "Address line 2 not available"}
                    </p>
                  </>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;