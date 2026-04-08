"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Quiénes Somos" },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Quiénes Somos</h1>

        {/* Club Image */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src="/Club.jpg"
            alt="Estadio Club Atlético Independiente"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            <strong className="text-foreground">Club Atlético Independiente de San Cayetano</strong> es una institución de la ciudad de San Cayetano, que abarca una gran variedad de disciplinas, como Basquet, Tenis, Fútbol, Billar Cinco Quillas, Natación y Automovilismo, entre otras.

            Se consagró campeón del Torneo Regional Federal Amateur 2022-23 de fútbol por la Región Pampeana Sur. Consiguió su pentacampeonato en el Torneo 2022 de la Liga Necochense de fútbol.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Nuestra Historia</h2>
            <p>
              El 23 de septiembre de 1922 se reunieron un grupo de personas interesadas en formar una nueva institución. El lugar elegido fue el Hotel Vasconia (frente a la estación de trenes); así, nació Independiente. Los presentes acordaron defender los colores Azul y Blanco, símbolos de la nueva entidad, la camiseta sería blanca con cuello azul y pantalón azul. Inmediatamente se procedió a gestionar ante la Municipalidad de Necochea, a la cual pertenecía San Cayetano en ese entonces, la concesión de los terrenos donde actualmente se encuentra la Plaza América. Es allí donde en 15 de abril de 1923 se inaugura la llamada entonces: “Plaza de Ejercicios Físicos” donde se practicarán las dos disciplinas con que se dio inicio al Club Independiente: Fútbol y Atletismo.

              En el año 1930 se produce otro hecho destacado en la vida de la institución, se adquieren los terrenos para emplazar el campo de juego, que hoy lleva el nombre de “Juan Bautista Marlats”, inaugurándose oficialmente el día 25 de mayo. El 8 de abril de 1934 se lleva a cabo la inauguración de las banderas y tribuna techada.

              En 1945 se concretó el anhelo de contar con una sede social propia. Después, se comenzó a trabajar en la construcción de 2 canchas de bochas, la instalación de un nuevo piso de deportes, la refacción de la fachada, finalizando las obras hacía 1966.

              En 1969 se conformó una subcomisión de automovilismo, y se logró la adquisición de una quinta de 15 hectáreas. En el siguiente año tuvo lugar la inauguración oficial del circuito Parque Independiente. En 1973, se le anexaron otras 5 hectáreas al predio, lo cual permitió la construcción de una pista hípica. En 2018, se asfaltó e inauguró el hoy Autódromo Parque Independiente, con apoyo provincial y municipal para su realización.

              En 1974 se inauguró la primera cancha de tenis, e instantáneamente se continuó con la construcción de una segunda cancha.

              En 1984 se habilitó la planta alta y 3 años más tarde, en el año 1987, en el Parque Independiente, se inauguró la pileta de natación, ahora llamada “Julio Heriberto Klink”, en homenaje al principal impulsor de su construcción.

              En 1997 se impusieron los nombres “Dr. Carlos Alberto Gómez” a la sala de reuniones y “Omar Flaco Parrachini” al gimnasio de la institución, años más tarde, hacía 2019 se denominó "Eduardo Flaco Hernández" a la cancha de fútbol sintético ubicada en la sede. Se bautizó también el vestuario local, en 1992 el de planta baja con el nombre de "Pedro Alberto Cabanas" y, en 2021 el de planta alta como "Brian Pavita Cortadi".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Títulos</h2>
            <p>
              En fútbol, el "Albo" se incorporó en 1943 en la LNF y se consagró campeón por primera vez en el año 1944. Luego de 6 años, el "Chimango" y en dos años consecutivos, 1950 y 1951, consiguió el segundo y el tercer título. 2 años después, en los años 1953 y 1954, llegaron el cuarto y quinto trofeo Necochense. Otra vez, el club tuvo que esperar 6 años para alzar el sexto título que en los años siguientes se convertiría en el primer tricampeonato (1960, 1961 y 1962). El noveno título Independiente logró obtenerlo 20 años más tarde que el octavo (1982). En 1998 llegaría el décimo título. Y 19 años después, con la conducción de Damián García Independiente volvió a salir campeón, en el año 2017, logrando el bicampeonato en el 2018, el tricampeonato en 2019 y el tetracampeonato en el 2021 (ya que el Torneo de LNF 2020 no se disputó por las ya conocidas razones de la pandemia global), este último (2021) fue tan importante para sus hinchas por coincidir con el Torneo que la Liga Necochense de fútbol decidió llamar "Brian Cortadi" en conmemoración al jugador, ex Alvarado (MdP), quien perdió su vida trágicamente en un accidente laboral. Hasta su centenario el club ya se anota 14 títulos en su haber. A finales del 2022 se consagró pentacampeón obteniendo así su estrella número 15, habiendo tenido la oportunidad de disputar y ganarle la final a su clásico rival, Sportivo de San Cayetano.
              <br/>
              En Basquet, fue campeón en 1970 de los torneos apertura y oficial, en tanto que en 1977 y 1978 se adjudicó todas las competencias oficiales que organizó la Asociación Tresarroyense. Con posteridad, se consagró Campeón en 1998, y más recientemente en 2019, de nuevo en la Asociación Necochense de Básquetbol, logrando así su quinto título.
            </p>
          </section>


          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">La Tienda Oficial</h2>
            <p>
              La Tienda Oficial del Club Atlético Independiente de San Cayetano ofrece a nuestros hinchas 
              la oportunidad de llevar consigo los colores de su club. Contamos con una amplia gama de productos 
              oficiales incluyendo camisetas, buzos, camperas, accesorios y mucho más.
            </p>
            <p className="mt-2">
              Todos nuestros productos son de primera calidad, con materiales resistentes y diseños exclusivos 
              que representan la identidad de nuestro club.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Visítanos</h2>
            <p>
              Te esperamos en nuestro local comercial ubicado en <strong className="text-foreground">Rivadavia 150, San Cayetano</strong>. 
              Nuestro horario de atención es de Lunes a Viernes de 9:00 a 12:00 y de 17:00 a 20:00hs.
            </p>
            <p className="mt-2">
              También podés contactarnos al{" "}
              <a 
                href="https://wa.me/5492983348357" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground font-bold hover:text-primary transition-colors"
              >
                +54 9 2983 34-8357
              </a>{" "}
              o escribinos a{" "}
              <a 
                href="mailto:alboshopcai@gmail.com"
                className="text-foreground font-bold hover:text-primary transition-colors"
              >
                alboshopcai@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

