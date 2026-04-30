import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { User, Users, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Registro de estudiante — UPC" }] }),
  component: RegistroPage,
});

type AcademicInfo = {
  id_estudiante: string;
  nombre_colegio: string;
  jornada_colegio: "mañana" | "tarde" | "noche";
  anio_promocion: number;
  carrera: string;
  jornada_universitaria: "mañana" | "tarde" | "noche" | "única";
  promedio: number;
  permanencia: "activo" | "inactivo" | "suspendido" | "transferido";
};

type GeneralInfo = {
  id_estudiante: string;
  nivel_deportivo: "ninguno" | "recreativo" | "competitivo";
  torneo_participado: string;
  club_perteneciente: string;
  peso: number;
  estatura: number;
  enfermedad_padecida: string;
  eps: string;
  rh: "a+" | "o+" | "b+" | "ab+" | "a-" | "o-" | "b-" | "ab-";
  trabaja_estudiante: boolean;
  lugar_trabajo: string;
  cargo_trabajo: string;
};

type FamilyInfo = {
  id_estudiante: string;
  nombre_madre: string;
  direccion_madre: string;
  ciudad_madre: string;
  celular_madre: string;
  ocupacion_madre: string;
  nombre_padre: string;
  direccion_padre: string;
  ciudad_padre: string;
  celular_padre: string;
  ocupacion_padre: string;
  observaciones: string;
};

function RegistroPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form1, setForm1] = useState({
    numero_documento: "",
    nombre_completo: "",
    tipo_documento: "cc" as "rc" | "cc" | "ti" | "ce" | "pep",
    sexo: "m" as "m" | "f" | "otros",
    fecha_nacimiento: "",
    lugar_nacimiento: "",
    estado_civil: "soltero/a" as "soltero/a" | "casado/a" | "union libre" | "viudo/a",
    direccion_residencial: "",
    barrio: "",
    numero_celular: "",
    email: "",
    tipo_estudiante: "interno" as "interno" | "externo" | "hijo de funcionario",
  });
  const [studentId, setStudentId] = useState("");

  const [form2, setForm2] = useState<AcademicInfo>({
    id_estudiante: "",
    nombre_colegio: "",
    jornada_colegio: "mañana",
    anio_promocion: new Date().getFullYear(),
    carrera: "",
    jornada_universitaria: "única",
    promedio: 0,
    permanencia: "activo",
  });

  const [form3, setForm3] = useState<GeneralInfo>({
    id_estudiante: "",
    nivel_deportivo: "ninguno",
    torneo_participado: "",
    club_perteneciente: "",
    peso: 0,
    estatura: 0,
    enfermedad_padecida: "",
    eps: "",
    rh: "a+",
    trabaja_estudiante: false,
    lugar_trabajo: "",
    cargo_trabajo: "",
  });

  const [form4, setForm4] = useState<FamilyInfo>({
    id_estudiante: "",
    nombre_madre: "",
    direccion_madre: "",
    ciudad_madre: "",
    celular_madre: "",
    ocupacion_madre: "",
    nombre_padre: "",
    direccion_padre: "",
    ciudad_padre: "",
    celular_padre: "",
    ocupacion_padre: "",
    observaciones: "",
  });

  const validateStep1 = () => {
    if (!form1.numero_documento.trim()) {
      setError("El número de documento es requerido");
      return false;
    }
    if (!form1.nombre_completo.trim()) {
      setError("El nombre completo es requerido");
      return false;
    }
    if (!form1.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form1.email)) {
      setError("Email inválido");
      return false;
    }
    if (!form1.fecha_nacimiento) {
      setError("La fecha de nacimiento es requerida");
      return false;
    }
    if (!form1.direccion_residencial.trim()) {
      setError("La dirección residencial es requerida");
      return false;
    }
    if (!form1.barrio.trim()) {
      setError("El barrio es requerido");
      return false;
    }
    if (!form1.numero_celular.trim()) {
      setError("El número celular es requerido");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    const f = form2;
    if (!f.nombre_colegio.trim()) {
      setError("Nombre del colegio es requerido");
      return false;
    }
    if (!f.carrera.trim()) {
      setError("Carrera es requerida");
      return false;
    }
    if (f.promedio < 0 || f.promedio > 5) {
      setError("Promedio debe estar entre 0 y 5");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep3 = () => {
    const f = form3;
    if (f.peso <= 0) {
      setError("Peso inválido");
      return false;
    }
    if (f.estatura <= 0) {
      setError("Estatura inválida");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep4 = () => {
    setError("");
    return true;
  };

  const nextStep = () => {
    const validators = [validateStep1, validateStep2, validateStep3, validateStep4];
    if (validators[step - 1]()) {
      if (step === 1) {
        setStudentId(form1.numero_documento);
        setForm2((prev) => ({ ...prev, id_estudiante: form1.numero_documento }));
        setForm3((prev) => ({ ...prev, id_estudiante: form1.numero_documento }));
        setForm4((prev) => ({ ...prev, id_estudiante: form1.numero_documento }));
      }
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }
    if (!validateStep4()) return;

    setLoading(true);
    setError("");
    try {
      console.log("Datos paso 1:", form1);
      console.log("Datos paso 2:", form2);
      console.log("Datos paso 3:", form3);
      console.log("Datos paso 4:", form4);

      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => navigate({ to: "/" }), 2000);
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 4) * 100;

  if (success) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Registro completado!</CardTitle>
            <CardDescription>Redirigiendo a la página principal...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Registro de Estudiante</CardTitle>
          <CardDescription>Completa los 4 pasos para registrarte en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
              <span className={step >= 1 ? "text-primary font-medium" : ""}>Paso 1</span>
              <span className={step >= 2 ? "text-primary font-medium" : ""}>Paso 2</span>
              <span className={step >= 3 ? "text-primary font-medium" : ""}>Paso 3</span>
              <span className={step >= 4 ? "text-primary font-medium" : ""}>Paso 4</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="numDoc">Número de documento</Label>
                  <Input
                    id="numDoc"
                    value={form1.numero_documento}
                    onChange={(e) => setForm1({ ...form1, numero_documento: e.target.value })}
                    placeholder="1234567890"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nombreCompleto">Nombre completo</Label>
                  <Input
                    id="nombreCompleto"
                    value={form1.nombre_completo}
                    onChange={(e) => setForm1({ ...form1, nombre_completo: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipoDoc">Tipo de documento</Label>
                  <Select
                    value={form1.tipo_documento}
                    onValueChange={(v) => setForm1({ ...form1, tipo_documento: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rc">RC</SelectItem>
                      <SelectItem value="cc">CC</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="ce">CE</SelectItem>
                      <SelectItem value="pep">PEP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={form1.sexo}
                    onValueChange={(v) => setForm1({ ...form1, sexo: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">Masculino</SelectItem>
                      <SelectItem value="f">Femenino</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fechaNac">Fecha de nacimiento</Label>
                  <Input
                    id="fechaNac"
                    type="date"
                    value={form1.fecha_nacimiento}
                    onChange={(e) => setForm1({ ...form1, fecha_nacimiento: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lugarNac">Lugar de nacimiento</Label>
                  <Input
                    id="lugarNac"
                    value={form1.lugar_nacimiento}
                    onChange={(e) => setForm1({ ...form1, lugar_nacimiento: e.target.value })}
                    placeholder="Ciudad"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estadoCivil">Estado civil</Label>
                  <Select
                    value={form1.estado_civil}
                    onValueChange={(v) => setForm1({ ...form1, estado_civil: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soltero/a">Soltero/a</SelectItem>
                      <SelectItem value="casado/a">Casado/a</SelectItem>
                      <SelectItem value="union libre">Unión libre</SelectItem>
                      <SelectItem value="viudo/a">Viudo/a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="direccion">Dirección residencial</Label>
                  <Input
                    id="direccion"
                    value={form1.direccion_residencial}
                    onChange={(e) => setForm1({ ...form1, direccion_residencial: e.target.value })}
                    placeholder="Calle y número"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="barrio">Barrio</Label>
                  <Input
                    id="barrio"
                    value={form1.barrio}
                    onChange={(e) => setForm1({ ...form1, barrio: e.target.value })}
                    placeholder="Nombre del barrio"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="celular">Número celular</Label>
                  <Input
                    id="celular"
                    value={form1.numero_celular}
                    onChange={(e) => setForm1({ ...form1, numero_celular: e.target.value })}
                    placeholder="3001234567"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emailReg">Correo electrónico</Label>
                  <Input
                    id="emailReg"
                    type="email"
                    value={form1.email}
                    onChange={(e) => setForm1({ ...form1, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipoEst">Tipo de estudiante</Label>
                  <Select
                    value={form1.tipo_estudiante}
                    onValueChange={(v) => setForm1({ ...form1, tipo_estudiante: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interno">Interno</SelectItem>
                      <SelectItem value="externo">Externo</SelectItem>
                      <SelectItem value="hijo de funcionario">Hijo de funcionario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Número de documento (ID)</Label>
                  <Input id="studentId" value={studentId} readOnly className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="colegio">Nombre de colegio egresado</Label>
                  <Input
                    id="colegio"
                    value={form2.nombre_colegio}
                    onChange={(e) => setForm2({ ...form2, nombre_colegio: e.target.value })}
                    placeholder="Colegio San José"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jornadaColegio">Jornada de colegio</Label>
                  <Select
                    value={form2.jornada_colegio}
                    onValueChange={(v) => setForm2({ ...form2, jornada_colegio: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mañana">Mañana</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noche">Noche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="anio">Año de la promoción</Label>
                  <Input
                    id="anio"
                    type="number"
                    value={form2.anio_promocion}
                    onChange={(e) =>
                      setForm2({
                        ...form2,
                        anio_promocion: parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    placeholder="2023"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carrera">Carrera que cursa</Label>
                  <Input
                    id="carrera"
                    value={form2.carrera}
                    onChange={(e) => setForm2({ ...form2, carrera: e.target.value })}
                    placeholder="Ingeniería de Sistemas"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jornadaUni">Jornada universitaria</Label>
                  <Select
                    value={form2.jornada_universitaria}
                    onValueChange={(v) => setForm2({ ...form2, jornada_universitaria: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mañana">Mañana</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noche">Noche</SelectItem>
                      <SelectItem value="única">Única</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promedio">Promedio</Label>
                  <Input
                    id="promedio"
                    type="number"
                    step="0.1"
                    value={form2.promedio}
                    onChange={(e) =>
                      setForm2({ ...form2, promedio: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.0 - 5.0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="permanencia">Permanencia</Label>
                  <Select
                    value={form2.permanencia}
                    onValueChange={(v) => setForm2({ ...form2, permanencia: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                      <SelectItem value="transferido">Transferido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="docId">Número de documento (ID)</Label>
                  <Input id="docId" value={studentId} readOnly className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nivelDeportivo">Nivel deportivo</Label>
                  <Select
                    value={form3.nivel_deportivo}
                    onValueChange={(v) => setForm3({ ...form3, nivel_deportivo: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ninguno">Ninguno</SelectItem>
                      <SelectItem value="recreativo">Recreativo</SelectItem>
                      <SelectItem value="competitivo">Competitivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="torneo">Torneo participado</Label>
                  <Input
                    id="torneo"
                    value={form3.torneo_participado}
                    onChange={(e) => setForm3({ ...form3, torneo_participado: e.target.value })}
                    placeholder="Nombre del torneo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="club">Club perteneciente</Label>
                  <Input
                    id="club"
                    value={form3.club_perteneciente}
                    onChange={(e) => setForm3({ ...form3, club_perteneciente: e.target.value })}
                    placeholder="Nombre del club"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    value={form3.peso}
                    onChange={(e) => setForm3({ ...form3, peso: parseInt(e.target.value) || 0 })}
                    placeholder="70"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estatura">Estatura (m)</Label>
                  <Input
                    id="estatura"
                    type="number"
                    step="0.01"
                    value={form3.estatura}
                    onChange={(e) =>
                      setForm3({ ...form3, estatura: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="1.75"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="enfermedad">Enfermedad padecida</Label>
                  <Input
                    id="enfermedad"
                    value={form3.enfermedad_padecida}
                    onChange={(e) => setForm3({ ...form3, enfermedad_padecida: e.target.value })}
                    placeholder="Ninguna"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eps">EPS</Label>
                  <Input
                    id="eps"
                    value={form3.eps}
                    onChange={(e) => setForm3({ ...form3, eps: e.target.value })}
                    placeholder="Nombre de la EPS"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rh">RH</Label>
                  <Select
                    value={form3.rh}
                    onValueChange={(v) => setForm3({ ...form3, rh: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a+">A+</SelectItem>
                      <SelectItem value="o+">O+</SelectItem>
                      <SelectItem value="b+">B+</SelectItem>
                      <SelectItem value="ab+">AB+</SelectItem>
                      <SelectItem value="a-">A-</SelectItem>
                      <SelectItem value="o-">O-</SelectItem>
                      <SelectItem value="b-">B-</SelectItem>
                      <SelectItem value="ab-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trabaja"
                    checked={form3.trabaja_estudiante}
                    onChange={(e) => setForm3({ ...form3, trabaja_estudiante: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="trabaja">¿Trabaja el estudiante?</Label>
                </div>
                {form3.trabaja_estudiante && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="lugarTrabajo">Lugar de trabajo</Label>
                      <Input
                        id="lugarTrabajo"
                        value={form3.lugar_trabajo}
                        onChange={(e) => setForm3({ ...form3, lugar_trabajo: e.target.value })}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cargoTrabajo">Cargo de trabajo</Label>
                      <Input
                        id="cargoTrabajo"
                        value={form3.cargo_trabajo}
                        onChange={(e) => setForm3({ ...form3, cargo_trabajo: e.target.value })}
                        placeholder="Cargo"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="docFam">Número de documento (ID)</Label>
                  <Input id="docFam" value={studentId} readOnly className="bg-muted" />
                </div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" /> Datos de la madre
                </h3>
                <div className="grid gap-2">
                  <Label htmlFor="nombreMadre">Nombre completo</Label>
                  <Input
                    id="nombreMadre"
                    value={form4.nombre_madre}
                    onChange={(e) => setForm4({ ...form4, nombre_madre: e.target.value })}
                    placeholder="María Pérez"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dirMadre">Dirección</Label>
                  <Input
                    id="dirMadre"
                    value={form4.direccion_madre}
                    onChange={(e) => setForm4({ ...form4, direccion_madre: e.target.value })}
                    placeholder="Calle 123"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ciudadMadre">Ciudad</Label>
                  <Input
                    id="ciudadMadre"
                    value={form4.ciudad_madre}
                    onChange={(e) => setForm4({ ...form4, ciudad_madre: e.target.value })}
                    placeholder="Bogotá"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="celMadre">Celular</Label>
                  <Input
                    id="celMadre"
                    value={form4.celular_madre}
                    onChange={(e) => setForm4({ ...form4, celular_madre: e.target.value })}
                    placeholder="3001234567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ocupMadre">Ocupación</Label>
                  <Input
                    id="ocupMadre"
                    value={form4.ocupacion_madre}
                    onChange={(e) => setForm4({ ...form4, ocupacion_madre: e.target.value })}
                    placeholder="Docente"
                  />
                </div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" /> Datos del padre
                </h3>
                <div className="grid gap-2">
                  <Label htmlFor="nombrePadre">Nombre completo</Label>
                  <Input
                    id="nombrePadre"
                    value={form4.nombre_padre}
                    onChange={(e) => setForm4({ ...form4, nombre_padre: e.target.value })}
                    placeholder="Carlos Pérez"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dirPadre">Dirección</Label>
                  <Input
                    id="dirPadre"
                    value={form4.direccion_padre}
                    onChange={(e) => setForm4({ ...form4, direccion_padre: e.target.value })}
                    placeholder="Calle 123"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ciudadPadre">Ciudad</Label>
                  <Input
                    id="ciudadPadre"
                    value={form4.ciudad_padre}
                    onChange={(e) => setForm4({ ...form4, ciudad_padre: e.target.value })}
                    placeholder="Bogotá"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="celPadre">Celular</Label>
                  <Input
                    id="celPadre"
                    value={form4.celular_padre}
                    onChange={(e) => setForm4({ ...form4, celular_padre: e.target.value })}
                    placeholder="3009876543"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ocupPadre">Ocupación</Label>
                  <Input
                    id="ocupPadre"
                    value={form4.ocupacion_padre}
                    onChange={(e) => setForm4({ ...form4, ocupacion_padre: e.target.value })}
                    placeholder="Ingeniero"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Input
                    id="observaciones"
                    value={form4.observaciones}
                    onChange={(e) => setForm4({ ...form4, observaciones: e.target.value })}
                    placeholder="Alguna observación relevante"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Anterior
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? "Registrando..." : "Finalizar registro"}
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
