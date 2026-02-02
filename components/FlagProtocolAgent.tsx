"use client";

import { useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUpDownIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { countries, Country } from "@/data/countries";
import {
  EventType,
  VenueType,
  OrderingCriteria,
  generateProtocolPlan
} from "@/lib/protocolEngine";

const eventTypes: { value: EventType; label: string; descripcion: string }[] = [
  {
    value: "nacional",
    label: "Acto nacional",
    descripcion: "Ceremonia con protagonismo exclusivo del país anfitrión."
  },
  {
    value: "bilateral",
    label: "Encuentro bilateral",
    descripcion: "Reunión oficial entre país anfitrión y una delegación invitada."
  },
  {
    value: "multilateral",
    label: "Cumbre multilateral",
    descripcion: "Acto con múltiples delegaciones oficiales o de organismos internacionales."
  },
  {
    value: "corporativo",
    label: "Evento corporativo",
    descripcion: "Acto institucional con presencia de banderas oficiales y corporativas."
  }
];

const venues: { value: VenueType; label: string }[] = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
  { value: "escenario", label: "Escenario con atril" },
  { value: "desfile", label: "Desfile o parada" }
];

const criterios: { value: OrderingCriteria; label: string }[] = [
  { value: "alfabetico", label: "Orden alfabético (idioma anfitrión)" },
  { value: "precedencia", label: "Rango de precedencia" },
  { value: "antiguedad", label: "Antigüedad de capitales" }
];

const todayIso = new Date().toISOString().split("T")[0];

const defaultHost = countries.find((country) => country.code === "ES") ?? countries[0];

export function FlagProtocolAgent() {
  const [host, setHost] = useState<Country>(defaultHost);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Country | null>(null);
  const [delegaciones, setDelegaciones] = useState<Country[]>([]);
  const [evento, setEvento] = useState<EventType>("bilateral");
  const [sede, setSede] = useState<VenueType>("interior");
  const [criterio, setCriterio] = useState<OrderingCriteria>("alfabetico");
  const [fecha, setFecha] = useState<string>(todayIso);
  const [incluirUE, setIncluirUE] = useState(false);
  const [incluirONU, setIncluirONU] = useState(false);
  const [banderaInstitucional, setBanderaInstitucional] = useState("");

  const filteredCountries = useMemo(() => {
    const data = countries.filter((country) => country.code !== host.code);
    if (!query) return data;
    return data.filter((country) =>
      country.nombre.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, host]);

  const plan = useMemo(() => {
    const scenarioFecha = fecha ? new Date(`${fecha}T03:00:00`) : new Date();
    return generateProtocolPlan({
      fecha: scenarioFecha,
      evento,
      sede,
      anfitrion: host,
      delegaciones,
      incorporarUE: incluirUE,
      incorporarONU: incluirONU,
      banderaInstitucional: banderaInstitucional || undefined,
      criterio
    });
  }, [host, delegaciones, evento, sede, fecha, incluirUE, incluirONU, banderaInstitucional, criterio]);

  const addDelegacion = (country: Country | null) => {
    if (!country) return;
    if (delegaciones.find((item) => item.code === country.code)) return;
    setDelegaciones((prev) => [...prev, country]);
    setSelected(null);
    setQuery("");
  };

  const removeDelegacion = (code: string) => {
    setDelegaciones((prev) => prev.filter((item) => item.code !== code));
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 py-10 px-4 lg:px-8">
      <header className="rounded-2xl bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
              Agente protocolario
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Protocolo de banderas a medida
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Define los detalles del acto y recibe un plan integral con orden de precedencia,
              guiones y cronograma operativo.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-6 py-4 text-primary-800">
            <p className="text-sm font-medium">Resumen inmediato</p>
            <p className="text-2xl font-semibold">{plan.orden.length} banderas</p>
            <p className="text-sm text-primary-700">{plan.resumen}</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold text-slate-900">Datos básicos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Selecciona país anfitrión, tipo de acto y fecha prevista.
            </p>

            <label className="mt-4 block text-sm font-medium text-slate-700">País anfitrión</label>
            <Combobox value={host} onChange={(value) => setHost(value)}>
              <div className="relative mt-2">
                <Combobox.Input
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  displayValue={(country: Country) => `${country.bandera} ${country.nombre}`}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-slate-500" />
                </Combobox.Button>

                <Transition
                  as={motion.div}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                    {filteredCountries.map((country) => (
                      <Combobox.Option
                        key={country.code}
                        value={country}
                        className={({ active }) =>
                          clsx(
                            "flex cursor-pointer items-center gap-2 px-4 py-2 text-sm",
                            active ? "bg-primary-50 text-primary-700" : "text-slate-700"
                          )
                        }
                      >
                        <span className="text-lg">{country.bandera}</span>
                        <span>{country.nombre}</span>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>

            <label className="mt-4 block text-sm font-medium text-slate-700">Tipo de acto</label>
            <div className="mt-2 grid grid-cols-1 gap-3">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setEvento(type.value)}
                  className={clsx(
                    "rounded-xl border px-4 py-3 text-left transition",
                    evento === type.value
                      ? "border-primary-500 bg-primary-50 text-primary-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:bg-primary-50/50"
                  )}
                >
                  <p className="text-sm font-semibold">{type.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{type.descripcion}</p>
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">Fecha del acto</label>
            <input
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold text-slate-900">Delegaciones invitadas</h2>
            <p className="mt-1 text-sm text-slate-600">
              Agrega los países o entidades que participarán para ordenar sus banderas.
            </p>

            <div className="mt-4">
              <Combobox value={selected} onChange={(value) => setSelected(value)}>
                <div className="relative">
                  <Combobox.Input
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Busca país o delegación"
                    displayValue={(country: Country | null) =>
                      country ? `${country.bandera} ${country.nombre}` : ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-slate-500" />
                  </Combobox.Button>

                  <Transition
                    as={motion.div}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      {filteredCountries.map((country) => (
                        <Combobox.Option
                          key={`guest-${country.code}`}
                          value={country}
                          className={({ active }) =>
                            clsx(
                              "flex cursor-pointer items-center gap-2 px-4 py-2 text-sm",
                              active ? "bg-primary-50 text-primary-700" : "text-slate-700"
                            )
                          }
                        >
                          <span className="text-lg">{country.bandera}</span>
                          <span>{country.nombre}</span>
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>

              <button
                type="button"
                onClick={() => addDelegacion(selected)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                <PlusIcon className="h-4 w-4" /> Añadir delegación
              </button>
            </div>

            <AnimatePresence initial={false}>
              {delegaciones.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 space-y-2"
                >
                  {delegaciones.map((delegacion) => (
                    <motion.li
                      key={delegacion.code}
                      layout
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{delegacion.bandera}</span>
                        {delegacion.nombre}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDelegacion(delegacion.code)}
                        className="rounded-lg border border-transparent p-1 text-slate-400 transition hover:border-slate-200 hover:text-slate-600"
                        aria-label={`Eliminar ${delegacion.nombre}`}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold text-slate-900">Personalización</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-medium text-slate-800">Ubicación del acto</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {venues.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSede(item.value)}
                      className={clsx(
                        "rounded-xl border px-4 py-2 text-left",
                        sede === item.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:bg-primary-50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-slate-800">Criterio de orden</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {criterios.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCriterio(item.value)}
                      className={clsx(
                        "rounded-xl border px-4 py-2 text-left text-sm",
                        criterio === item.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:bg-primary-50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incluirUE}
                  onChange={(event) => setIncluirUE(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Incorporar bandera de la Unión Europea
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incluirONU}
                  onChange={(event) => setIncluirONU(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Incorporar bandera de la ONU
              </label>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Bandera institucional (opcional)
                </label>
                <input
                  type="text"
                  value={banderaInstitucional}
                  onChange={(event) => setBanderaInstitucional(event.target.value)}
                  placeholder="Ej. Universidad Nacional"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <motion.section
            layout
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/80"
          >
            <h2 className="text-xl font-semibold text-slate-900">Orden de banderas recomendado</h2>
            <p className="mt-1 text-sm text-slate-600">
              Distribución desde la derecha del público hacia la izquierda. Ajusta altura de mástiles para conservar la horizontal visual.
            </p>

            <ol className="mt-6 space-y-3">
              {plan.orden.map((item) => (
                <li
                  key={`${item.actor}-${item.posicion}`}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {item.posicion}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.actor}</p>
                    <p className="text-sm text-slate-600">{item.descripcion}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>

          <motion.section
            layout
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/80"
          >
            <h2 className="text-xl font-semibold text-slate-900">Guion ceremonial sugerido</h2>
            <p className="mt-1 text-sm text-slate-600">
              Instrucciones clave para el maestro de ceremonias y equipo de protocolo.
            </p>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {plan.briefings.map((briefing) => (
                <div
                  key={briefing.titulo}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  <p className="text-sm font-semibold text-primary-700">{briefing.titulo}</p>
                  <p className="mt-1 text-sm text-slate-700">{briefing.detalles}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            layout
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/80"
          >
            <h2 className="text-xl font-semibold text-slate-900">Cronograma operativo</h2>
            <p className="mt-1 text-sm text-slate-600">
              Acciones previas al acto para asegurar montaje y ceremonial sin incidencias.
            </p>

            <ul className="mt-5 space-y-3">
              {plan.cronograma.map((item) => (
                <li
                  key={item.hito}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-700"
                >
                  <p className="font-semibold text-slate-900">{item.hito}</p>
                  <p>{item.responsable}</p>
                  <p className="text-xs text-slate-500">{item.fecha}</p>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </section>
    </div>
  );
}
