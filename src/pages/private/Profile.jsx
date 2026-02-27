import { PrivateLayout } from '../../components/index.js';
import { SectionHeader, Card } from '../../components/index.js';
import { useAuth } from '../../hooks/index.js';

export default function Profile() {
  const { user } = useAuth();
  const displayName = user?.firstName ?? user?.username ?? 'Usuario';

  return (
    <PrivateLayout>
      <section className="page-profile">
        <SectionHeader title="Perfil" subtitle={displayName} />
        <Card>
          <p>Edición de perfil (datos de contacto, imagen, contraseña) en construcción.</p>
          <p className="text-muted">Usa useForm + userService/employeeService según rol.</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}
