import RegisterForms from '../components/RegisterForms';
import axios from 'axios';

export default function Register() {
  const handleRegister = async (formData) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/accounts/create',
        formData
      );

      alert('Usuario registrado correctamente');
      console.log(response.data);
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Registro de Usuario
      </h1>
      <RegisterForms onRegister={handleRegister} />
    </div>
  );
}
