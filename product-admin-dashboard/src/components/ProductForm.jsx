import { useState } from "react";

function ProductForm({
  initialValues,
  onSubmit,
  buttonText,
}) {
  const [form, setForm] = useState({
    title: initialValues?.title || "",
    description:
      initialValues?.description || "",
    price: initialValues?.price || "",
    category:
      initialValues?.category || "",
    rating:
      initialValues?.rating || "",
    stock: initialValues?.stock || "",
  });

  const [errors, setErrors] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title =
        "Title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    if (!form.category.trim()) {
      newErrors.category =
        "Category is required.";
    }

    if (
      form.price === "" ||
      Number(form.price) <= 0
    ) {
      newErrors.price =
        "Price must be greater than 0.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      newErrors.stock =
        "Stock cannot be negative.";
    }

    const rating = Number(
      form.rating
    );

    if (
      form.rating === "" ||
      rating < 0 ||
      rating > 5
    ) {
      newErrors.rating =
        "Rating must be between 0 and 5.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (saving) return;

    if (!validate()) return;

    const normalizedForm = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      stock: Number(form.stock),
    };

    try {
      setSaving(true);

      await onSubmit(
        normalizedForm
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <label>Title</label>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
      />

      {errors.title && (
        <span className="field-error">
          {errors.title}
        </span>
      )}

      <label>Description</label>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />

      {errors.description && (
        <span className="field-error">
          {errors.description}
        </span>
      )}

      <label>Category</label>

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      {errors.category && (
        <span className="field-error">
          {errors.category}
        </span>
      )}

      <label>Price</label>

      <input
        type="number"
        step="0.01"
        name="price"
        value={form.price}
        onChange={handleChange}
      />

      {errors.price && (
        <span className="field-error">
          {errors.price}
        </span>
      )}

      <label>Rating</label>

      <input
        type="number"
        step="0.1"
        name="rating"
        value={form.rating}
        onChange={handleChange}
      />

      {errors.rating && (
        <span className="field-error">
          {errors.rating}
        </span>
      )}

      <label>Stock</label>

      <input
        type="number"
        name="stock"
        value={form.stock}
        onChange={handleChange}
      />

      {errors.stock && (
        <span className="field-error">
          {errors.stock}
        </span>
      )}

      <button
        type="submit"
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : buttonText}
      </button>
    </form>
  );
}

export default ProductForm;