import { useState } from 'react';
import { ROOM_TYPES, ROOM_STATUSES } from '../data/rooms';
import { sanitizeInput } from '../utils/sanitize';

const EMPTY_FORM = { number: '', type: '', status: '' };

/**
 * AddRoomModal - form for registering a new room.
 * - All fields are required (room number + two dropdowns).
 * - Room numbers must be unique across the existing room list.
 * - Every text value is run through sanitizeInput() before it is ever
 *   passed up to App.jsx, stripping script/HTML tags to prevent XSS.
 */
function AddRoomModal({ isOpen, onClose, onAddRoom, existingNumbers }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error as soon as the user starts fixing it
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (cleanNumber) => {
    const nextErrors = {};

    if (!cleanNumber) {
      nextErrors.number = 'Room number is required.';
    } else if (existingNumbers.includes(cleanNumber)) {
      nextErrors.number = `Room ${cleanNumber} already exists.`;
    }

    if (!form.type) {
      nextErrors.type = 'Please select a room type.';
    }

    if (!form.status) {
      nextErrors.status = 'Please select a status.';
    }

    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sanitize the free-text room number before validating/storing it
    const cleanNumber = sanitizeInput(form.number);

    const nextErrors = validate(cleanNumber);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onAddRoom({
      number: cleanNumber,
      type: form.type,
      status: form.status,
    });

    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" role="presentation" onClick={handleClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-room-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="add-room-title" className="modal__title">Add New Room</h2>
          <button
            type="button"
            className="modal__close"
            onClick={handleClose}
            aria-label="Close add room form"
          >
            ✕
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="room-number">Room Number</label>
            <input
              id="room-number"
              type="text"
              value={form.number}
              onChange={(e) => handleChange('number', e.target.value)}
              className={errors.number ? 'input-error' : ''}
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? 'room-number-error' : undefined}
              placeholder="e.g. 204"
            />
            {errors.number && (
              <p id="room-number-error" className="form-field__error" role="alert">
                {errors.number}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="room-type">Room Type</label>
            <select
              id="room-type"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className={errors.type ? 'input-error' : ''}
              aria-invalid={Boolean(errors.type)}
              aria-describedby={errors.type ? 'room-type-error' : undefined}
            >
              <option value="">Select a room type…</option>
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && (
              <p id="room-type-error" className="form-field__error" role="alert">
                {errors.type}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="room-status">Status</label>
            <select
              id="room-status"
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={errors.status ? 'input-error' : ''}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? 'room-status-error' : undefined}
            >
              <option value="">Select a status…</option>
              {ROOM_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {errors.status && (
              <p id="room-status-error" className="form-field__error" role="alert">
                {errors.status}
              </p>
            )}
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal;
