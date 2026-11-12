import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import FormField from "../components/FormField/FormField";
import Button from "../components/Button/Button";
import { getCurrentUser, updateUser } from "../services/userService"; // Importamos el servicio
import "./EditProfilePage.css";

export default function EditProfilePage() {
  const navigate = useNavigate();

  // Estados iniciales vacíos
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [foto, setFoto] = useState("");
  const [errorFoto, setErrorFoto] = useState("");
  const [procesandoFoto, setProcesandoFoto] = useState(false);

  useEffect(() => {
    // Cargamos los datos del usuario actual al entrar a la página
    const user = getCurrentUser();
    if (user) {
      setNombre(user.nombre);
      setCorreo(user.email);
      setTelefono(user.telefono || "");
      setCiudad(user.ciudad || "");
      setFoto(user.foto || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  function seleccionarFoto(event) {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    setErrorFoto("");

    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      setErrorFoto("Selecciona un archivo de imagen válido.");
      return;
    }
    if (archivo.size > 10 * 1024 * 1024) {
      setErrorFoto("La imagen debe pesar menos de 10 MB.");
      return;
    }

    setProcesandoFoto(true);
    const lector = new FileReader();
    lector.onerror = () => {
      setErrorFoto("No se pudo leer la imagen seleccionada.");
      setProcesandoFoto(false);
    };
    lector.onload = () => {
      const imagen = new Image();
      imagen.onerror = () => {
        setErrorFoto("No se pudo abrir la imagen seleccionada.");
        setProcesandoFoto(false);
      };
      imagen.onload = () => {
        try {
          const maxDimension = 512;
          const escala = Math.min(
            1,
            maxDimension / Math.max(imagen.width, imagen.height),
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(imagen.width * escala));
          canvas.height = Math.max(1, Math.round(imagen.height * escala));

          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("No se pudo procesar la imagen.");
          }

          context.drawImage(imagen, 0, 0, canvas.width, canvas.height);
          setFoto(canvas.toDataURL("image/jpeg", 0.82));
          setProcesandoFoto(false);
        } catch (error) {
          setErrorFoto(
            error instanceof Error
              ? error.message
              : "No se pudo procesar la imagen.",
          );
          setProcesandoFoto(false);
        }
      };
      imagen.src = String(lector.result);
    };
    lector.readAsDataURL(archivo);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (procesandoFoto) return;

    const updatedUser = {
      ...getCurrentUser(), // Mantenemos los campos que no cambian (password, fechaRegistro)
      nombre: nombre,
      email: correo,
      telefono: telefono,
      ciudad: ciudad,
      foto,
    };

    try {
      updateUser(updatedUser);
      alert("Perfil actualizado correctamente");
      navigate("/app/perfil");
    } catch (error) {
      setErrorFoto(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los cambios del perfil.",
      );
    }
  };

  return (
    <div className="edit-profile-page">
      <HeaderBar
        title="Editar Perfil"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <main className="edit-profile-page__content">
        <form onSubmit={handleSubmit} className="edit-profile-page__form">
          <div className="edit-profile-page__avatar-section">
            <img
              src={
                foto ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
              }
              alt={`Foto de perfil de ${nombre || "usuario"}`}
              className="edit-profile-page__avatar"
            />
            <input
              id="edit-profile-photo"
              className="edit-profile-page__photo-input"
              type="file"
              accept="image/*"
              onChange={seleccionarFoto}
            />
            <label
              htmlFor="edit-profile-photo"
              className="edit-profile-page__change-photo"
            >
              {foto ? "Cambiar foto de perfil" : "Subir foto de perfil"}
            </label>
            {procesandoFoto && <p role="status">Procesando foto...</p>}
            {errorFoto && <p role="alert">{errorFoto}</p>}
          </div>

          <FormField
            label="Nombre y Apellidos"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <FormField
            label="Correo electrónico"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <FormField
            label="Teléfono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <FormField
            label="Ciudad"
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />

          <div className="edit-profile-page__actions">
            <Button variant="primary" type="submit" disabled={procesandoFoto}>
              Guardar Cambios
            </Button>
            <Button variant="secondary" onClick={() => navigate("/app/perfil")}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
