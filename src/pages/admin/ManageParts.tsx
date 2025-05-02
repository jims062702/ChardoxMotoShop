import { useState } from "react";

const ManageParts = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/parts/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Part added successfully!");
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };

  return (
    <div>
      <h2>Add Motorcycle Part</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Part Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button type="submit">Add Part</button>
      </form>
    </div>
  );
};

export default ManageParts;
