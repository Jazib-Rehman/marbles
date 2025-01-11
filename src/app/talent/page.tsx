"use client";

import generateBlurredImage from "@/utils/GenerateBlurredImage";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select"; // Importing react-select for searchable dropdown
import locations from "@/utils/locations.json";
import { Talent } from "@/types";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SubCategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  type: "Multi-select" | "Single-select";
  subcategories: SubCategory[];
}

interface Role {
  _id: string;
  title: string;
  categories: Category[];
}

const TalentProfile: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the profile image file
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [roles, setRoles] = useState<Role[]>([]); // Dynamic roles fetched from API
  const [selectedRole, setSelectedRole] = useState<Role | null>(null); // Selected role
  const [monthlyHourly, setMonthlyHourly] = useState(""); // Selected role
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, string | string[]>
  >({});
  const cvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedLocations, setSelectedLocations] = useState(""); // State for selected locations

  const [isCVDragActive, setIsCVDragActive] = useState(false); // For CV
  const [isImageDragActive, setIsImageDragActive] = useState(false); // For Image
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false); // State for submission modal
  const [isSubmitActive, setIsSubmitActive] = useState(true); // State for submission modal
  const [allCategories, setAllCategories] = useState<Category[]>([]); // State for submission modal
  const [selectedEngagementTypes, setSelectedEngagementTypes] = useState<
    string[]
  >([]);
  const [selectedWorkingModels, setSelectedWorkingModels] = useState<string[]>(
    []
  );
  const [talent, setTalent] = useState<Talent>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const talentId = localStorage.getItem("talentId");
    if (!talentId) return;

    const fetchTalent = async () => {
      try {
        const response = await fetch("/api/talents/getById", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: talentId }),
        });

        if (response.ok) {
          const talentData = await response.json();
          setTalent(talentData);
          setMonthlyHourly(talentData?.monthlyHourly || "");
          setSelectedLocations(talentData?.location || "");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTalent();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const catRes = await fetch("/api/get-categories");
        const catData = await catRes.json();
        setAllCategories(catData.categories);
        const response = await fetch("/api/get-roles");
        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleEngagementTypeChange = (type: string) => {
    setSelectedEngagementTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleWorkingModelChange = (model: string) => {
    setSelectedWorkingModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  useEffect(() => {
    if (talent && allCategories.length > 0) {
      setSelectedEngagementTypes(talent.engagementType || []);
      setSelectedWorkingModels(talent.workingModel || []);
      // Match role
      const matchedRole =
        roles.find((role) => role._id === talent.role) || null;
      setSelectedRole(matchedRole);

      // Match categories and subcategories
      const matchedCategories = talent.categories
        .map((category: any) => {
          const fullCategory = allCategories.find(
            (cat: any) => cat._id === category.categoryId?._id
          );
          console.log({ categoryId: category.categoryId?._id });

          if (fullCategory) {
            // Match subcategories
            const selectedSubcategories = category.selectedSubcategories
              .map((subId: string) => {
                const subcategory = fullCategory.subcategories.find(
                  (sub: any) => sub._id === subId
                );
                return subcategory
                  ? { value: subcategory._id, label: subcategory.name }
                  : null;
              })
              .filter(Boolean); // Filter out null values

            return {
              ...fullCategory,
              selectedSubcategories, // Use the matched subcategories
            };
          }

          return null;
        })
        .filter(Boolean); // Filter out null values

      // Update selected categories state
      const processedCategories = matchedCategories.reduce(
        (acc: any, category: any) => {
          acc[category._id] = category.selectedSubcategories.map(
            (sub: any) => sub.value
          );
          return acc;
        },
        {}
      );
      setSelectedCategories(processedCategories);
    }
  }, [talent, roles, allCategories]);

  // Flatten locations JSON into options with groups
  const locationOptions = locations.locations.flatMap(({ title, options }) => 
    options.map(option => ({
      value: option,
      label: option,
      group: title // Add group information for better organization
    }))
  );

  // Update handleLocationChange to handle selected option correctly
  const handleLocationChange = (selectedOptions: any) => {
    setSelectedLocations(selectedOptions ? selectedOptions.value : ""); // Use value instead of label
  };

  const handleCVDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsCVDragActive(true);
  };

  const handleCVDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsCVDragActive(false);
  };

  const handleCVDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCVDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsCVDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
      console.log("File dropped:", event.dataTransfer.files[0]);
    }
  };

  const handleImageDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragActive(true);
  };

  const handleImageDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragActive(false);
  };

  const handleImageDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleImageDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setImageFile(event.dataTransfer.files[0]);
      console.log("Image dropped:", event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile);
    }
  };

  const handleCVDropAreaClick = () => {
    cvInputRef.current?.click();
  };

  const handleImgDropAreaClick = () => {
    imageInputRef.current?.click();
  };

  const handleRoleChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    const selected =
      roles.find((role) => role._id === selectedOption?.value) || null;
    setSelectedRole(selected);
    setSelectedCategories({});
  };

  const handleCategoryChange = (
    categoryId: string,
    value: string | string[]
  ) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitActive(false);
    setLoading(true);
    setError(null);

    // Gather form data
    const formData = new FormData(event.target as HTMLFormElement);
    const jsonData = Object.fromEntries(formData.entries());

    if (!jsonData.name) {
      setError("Your name is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!jsonData.email) {
      setError("Your email is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!jsonData.phone) {
      setError("Your phone is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!selectedEngagementTypes.length) {
      setError("Type of work engagement is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!selectedWorkingModels.length) {
      setError("Working Model is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!jsonData.experience) {
      setError("Experience is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!jsonData.salaryRange) {
      setError("Working rate is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!jsonData.techStack) {
      setError("Tech Stack is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (!jsonData.linkedInProfile) {
      setError("LinkedIn Profile is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (monthlyHourly === "") {
      setError("Monthly / Hourly is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }
    if (selectedLocations === "") {
      setError("Location is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }

    if (!selectedRole) {
      setError("Role is required.");
      window.scroll(0, 0);
      setLoading(false);
      return;
    }

    // Transform selectedCategories into the correct structure for the backend
    const transformedCategories = Object.entries(selectedCategories).map(
      ([categoryId, selectedSubcategories]) => ({
        categoryId,
        selectedSubcategories: Array.isArray(selectedSubcategories)
          ? selectedSubcategories
          : [selectedSubcategories],
      })
    );

    let fileUrl = null;

    try {
      // Upload file to S3 if available
      if (!file && !talent?.fileUrl) {
        setError("Resume/CV is required.");
        window.scroll(0, 0);
        setLoading(false);
        return;
      } else if (file) {
        const response = await fetch("/api/s3-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileType: file.type }),
        });
        if (!response.ok) throw new Error("Failed to get S3 upload URL");

        const {
          uploadUrl,
          fileUrl: s3FileUrl,
          fileKey,
        } = await response.json();
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        fileUrl = fileKey;
      }

      let profileImage = {
        clean: null,
        blurred: null,
      };

      try {
        if (imageFile) {
          // Step 1: Upload the clean image
          const cleanResponse = await fetch("/api/s3-upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileType: imageFile.type }),
          });

          if (!cleanResponse.ok)
            throw new Error("Failed to get S3 upload URL for clean image");

          const { uploadUrl: cleanUploadUrl, fileKey: cleanFileKey } =
            await cleanResponse.json();

          await fetch(cleanUploadUrl, {
            method: "PUT",
            headers: { "Content-Type": imageFile.type },
            body: imageFile,
          });

          profileImage.clean = cleanFileKey;

          // Step 2: Generate blurred image on the client
          const blurredImage = await generateBlurredImage(imageFile);

          // Step 3: Upload the blurred image
          const blurredResponse = await fetch("/api/s3-upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileType: blurredImage.type }),
          });

          if (!blurredResponse.ok)
            throw new Error("Failed to get S3 upload URL for blurred image");

          const { uploadUrl: blurredUploadUrl, fileKey: blurredFileKey } =
            await blurredResponse.json();

          await fetch(blurredUploadUrl, {
            method: "PUT",
            headers: { "Content-Type": blurredImage.type },
            body: blurredImage,
          });

          profileImage.blurred = blurredFileKey;
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Image upload or processing failed."
        );
        setLoading(false);
        return;
      }

      const data = {
        ...jsonData,
        categories: transformedCategories,
        engagementType: selectedEngagementTypes,
        workingModel: selectedWorkingModels, // Working model as array
        role: selectedRole?._id || talent?.role,
        location: selectedLocations || talent?.location,
        fileUrl, // Resume/CV file URL
        profileImage, // Clean and blurred profile image
        talentId: talent?._id, // ID for update
      };

      const response = await fetch("/api/talents/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to update talent");
      }

      console.log("Registration successful");
      setIsSubmitModalOpen(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
      setIsSubmitActive(true);
    }
  };

  const onCloseModal = () => {
    setIsSubmitModalOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Call the delete API
      const response = await fetch("/api/talents/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentId: talent?._id }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete profile");
      }

      // Clear localStorage and cookies
      localStorage.clear();
      document.cookie =
        "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect user after deletion
      router.push("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
      setError("Failed to delete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  if (!talent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="absolute top-0 w-full bg-white flex justify-center z-50 py-10">
      <Link href={"/"} className="mr-10 mt-8">
        <div className="flex items-center">
          <FaChevronLeft />
          <p className="ml-2">Back</p>
        </div>
      </Link>
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center">
            <h2 className="text-3xl font-semibold ml-4">Profile</h2>
          </div>
        </div>

        <div className="bg-blue-100 p-4 text-left">
          {/* Welcome Section */}
          {/* <div className="mt-6 rounded-md">
            <h3 className="text-2xl font-semibold text-primary">
              Welcome to our Talent Place!
            </h3>
            <p className="text-primary">
              Please take a moment to make us aware about yourself, highlight
              your skills, criteria, expectations and vision about your next
              challenging position.
            </p>
          </div> */}

          {/* Error Message */}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Form Section */}
          <form className="mt-6 space-y-4 text-primary" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="font-semibold text-primary">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={talent?.name || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="text-left">
                <label className="font-semibold text-primary">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={talent?.email || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="text-left">
                <label className="font-semibold text-primary">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={talent?.phone || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              {/* Location Selection */}
              <div className="text-left">
                <label className="font-semibold text-primary">
                  Current Location
                </label>
                <Select
                  options={locationOptions}
                  value={
                    selectedLocations
                      ? { value: selectedLocations, label: selectedLocations }
                      : talent?.location
                      ? { value: talent.location, label: talent.location }
                      : null
                  }
                  onChange={handleLocationChange}
                  placeholder="Select current location or region"
                  className="w-full"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                    }),
                  }}
                />
              </div>
            </div>

            {/* Type of Work Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-left">
                <label className="font-semibold text-primary block mb-2">
                  Type of work engagement *
                </label>
                <div className="flex flex-wrap">
                  {["fullTime", "partTime", "freelance", "contractor"].map(
                    (type) => (
                      <label
                        key={type}
                        className="w-full cursor-pointer flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEngagementTypes.includes(type)}
                          onChange={() => handleEngagementTypeChange(type)}
                        />
                        <span>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="text-left">
                <label className="font-semibold text-primary block mb-2">
                  Working Model *
                </label>
                <div className="flex flex-wrap">
                  {["fullyRemote", "hybrid", "onSite"].map((model) => (
                    <label
                      key={model}
                      className="w-full cursor-pointer flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWorkingModels.includes(model)}
                        onChange={() => handleWorkingModelChange(model)}
                      />
                      <span>
                        {model.charAt(0).toUpperCase() + model.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-left">
                <label className="font-semibold text-primary">
                  Years of experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  defaultValue={talent?.experience || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="font-semibold text-primary">
                  Working Rate{" "}
                  <span className="text-sm font-normal">in EUR</span> *
                </label>
                <input
                  type="number"
                  name="salaryRange"
                  defaultValue={talent?.salaryRange || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="text-left">
                <label className="font-semibold text-primary">
                  Monthly / Hourly *
                </label>
                <Select
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "hourly", label: "Hourly" },
                  ]}
                  value={
                    monthlyHourly
                      ? {
                          value: monthlyHourly,
                          label:
                            monthlyHourly.charAt(0).toUpperCase() +
                            monthlyHourly.slice(1),
                        }
                      : talent?.monthlyHourly
                      ? {
                          value: talent.monthlyHourly,
                          label:
                            talent.monthlyHourly.charAt(0).toUpperCase() +
                            talent.monthlyHourly.slice(1),
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setMonthlyHourly(selected ? selected.value : "")
                  }
                  placeholder="Select..."
                  className="w-full"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                    }),
                  }}
                />
              </div>
            </div>
            {/* Role Dropdown */}
            <div className="text-left">
              <label className="font-semibold text-primary">Role *</label>
              <Select
                options={roles?.map((role) => ({
                  value: role._id,
                  label: role.title,
                }))}
                value={
                  selectedRole
                    ? { value: selectedRole._id, label: selectedRole.title }
                    : null
                }
                onChange={handleRoleChange}
                className="w-full"
                placeholder="Select a role"
                isSearchable
              />
            </div>

            {selectedRole && selectedRole.categories.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {selectedRole.categories.map((category) => {
                  const matchedCategory = allCategories.find(
                    (cat: any) => cat._id === category._id
                  );

                  if (!matchedCategory) return null;

                  return (
                    <div key={matchedCategory._id} className="mb-4">
                      <label className="font-semibold text-primary">
                        {matchedCategory.name}
                      </label>
                      {matchedCategory.type === "Multi-select" ? (
                        <Select
                          isMulti
                          options={matchedCategory.subcategories.map((sub) => ({
                            value: sub._id,
                            label: sub.name,
                          }))}
                          value={
                            Array.isArray(
                              selectedCategories[matchedCategory._id]
                            )
                              ? (
                                  selectedCategories[
                                    matchedCategory._id
                                  ] as string[]
                                )
                                  .map((subId) => {
                                    const sub =
                                      matchedCategory.subcategories.find(
                                        (s) => s._id === subId
                                      );
                                    return sub
                                      ? { value: sub._id, label: sub.name }
                                      : null;
                                  })
                                  .filter(
                                    (
                                      item
                                    ): item is {
                                      value: string;
                                      label: string;
                                    } => !!item
                                  ) // Filter out null values with type guard
                              : []
                          }
                          onChange={(selected) =>
                            handleCategoryChange(
                              matchedCategory._id,
                              Array.isArray(selected)
                                ? selected.map((option) => option.value) // Safely map only if `selected` is an array
                                : []
                            )
                          }
                          placeholder={`Select multiple ${matchedCategory.name}`}
                          className="w-full"
                        />
                      ) : (
                        <Select
                          options={matchedCategory.subcategories.map(
                            (sub: any) => ({
                              value: sub._id,
                              label: sub.name,
                            })
                          )}
                          value={
                            selectedCategories[matchedCategory._id]?.[0]
                              ? {
                                  value:
                                    selectedCategories[matchedCategory._id][0],
                                  label:
                                    matchedCategory.subcategories.find(
                                      (sub: any) =>
                                        sub._id ===
                                        selectedCategories[
                                          matchedCategory._id
                                        ][0]
                                    )?.name || "",
                                }
                              : null
                          }
                          onChange={(selected) =>
                            handleCategoryChange(
                              matchedCategory._id,
                              selected ? [selected.value] : []
                            )
                          }
                          placeholder={`Select one ${matchedCategory.name}`}
                          className="w-full"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="font-semibold text-primary">
                  LinkedIn Profile *
                </label>
                <input
                  type="text"
                  name="linkedInProfile"
                  defaultValue={talent?.linkedInProfile || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="text-left">
                <label className="font-semibold text-primary">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  name="githubProfile"
                  defaultValue={talent?.githubProfile || ""}
                  className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="text-left mt-4">
              <label className="font-semibold text-primary">
                Description *
              </label>
              <textarea
                name="techStack"
                defaultValue={talent?.techStack || ""}
                className="w-full p-3 border focus:outline-none focus:ring focus:ring-blue-300"
                rows={4}
              ></textarea>
            </div>

            <div>
              <label className="font-semibold text-primary">
                Upload your resume/CV *
              </label>

              <div
                className={`w-full p-6 border-2 border-dashed ${
                  isCVDragActive ? "bg-gray-200" : "bg-white"
                } transition flex flex-col items-center justify-center cursor-pointer`}
                onClick={handleCVDropAreaClick}
                onDragEnter={handleCVDragEnter}
                onDragLeave={handleCVDragLeave}
                onDragOver={handleCVDragOver}
                onDrop={handleCVDrop}
              >
                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-blue-600 text-2xl mb-2">&#8686;</p>
                <p className="text-gray-600">
                  {file
                    ? `Selected File: ${file.name}`
                    : "Drag and Drop (or) Click to Select a File"}
                </p>
              </div>

              {/* Download CV Button */}
              {talent?.fileUrlSigned && (
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = talent.fileUrlSigned;
                    link.download = "Resume.pdf"; // Set the desired file name
                    link.click();
                  }}
                  className="mt-2 underline"
                >
                  Download CV
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="font-semibold text-primary">
                Upload Profile Image (Optional)
              </label>
              <div
                className={`w-full p-6 border-2 border-dashed ${
                  isImageDragActive ? "bg-gray-200" : "bg-white"
                } transition flex flex-col items-center justify-center cursor-pointer`}
                onClick={handleImgDropAreaClick}
                onDragEnter={handleImageDragEnter}
                onDragLeave={handleImageDragLeave}
                onDragOver={handleImageDragOver}
                onDrop={handleImageDrop}
              >
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    if (selectedFile) setImageFile(selectedFile);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-blue-600 text-2xl mb-2">&#8686;</p>
                <p className="text-gray-600">
                  {imageFile
                    ? `Selected Image: ${imageFile.name}`
                    : "Drag and Drop (or) Click to Select an Image"}
                </p>
              </div>

              {/* View Profile Picture Button */}
              {talent?.profileImage?.cleanSigned && (
                <button
                  onClick={() => {
                    const imageWindow = window.open(
                      talent?.profileImage?.cleanSigned,
                      "_blank"
                    );
                    if (imageWindow) {
                      imageWindow.focus();
                    }
                  }}
                  className="mt-2 underline"
                >
                  View Profile Picture
                </button>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <button
                type="submit"
                className="flex items-center px-4 bg-primary text-white py-3 font-semibold hover:bg-purple-900 transition mt-4"
              >
                Save changes
                {loading ? <span className="ml-3 loader"></span> : null}
              </button>
              <button
                type="button"
                onClick={openDeleteModal} // Open the delete confirmation modal
                className="flex items-center px-4 bg-red-500 text-white py-3 font-semibold hover:bg-red-900 transition mt-4"
              >
                Delete Profile
                {loading ? <span className="ml-3 loader"></span> : null}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Confirmation Modal for Delete Profile */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete your profile? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete} // Call delete API and handle user redirection
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>
              <button
                onClick={closeDeleteModal} // Close the delete confirmation modal
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isSubmitModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Your form is submitted!
            </h2>
            <p className="text-gray-700">
              Talent information has been updated successfully.
            </p>

            <button
              onClick={onCloseModal}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentProfile;
