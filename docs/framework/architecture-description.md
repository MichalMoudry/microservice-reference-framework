# Popis architektury mikroslužeb

## Přehled a popis
**Mikroslužby** nebo také **Architektura mikroslužeb** označuje architektonický styl pro tvorbu softwarových řešení, které jsou založeny na množině služeb, přičemž jednotlivé služby jsou nasaditelné nezávisle na ostatních službách a jsou modelovány okolo stanovené business domény (tzn. obalují business funkcionalitu a poskytují ji skrze definované rozhraní). Tyto služby běží ve vlastních procesech a nejsou mezi nimi přímé závislosti, přičemž pro komunikaci mezi sebou využívají asynchronní komunikaci.

Tedy systémy založené na architektuře mikroslužeb patří mezi typ distribuovaných systémů. Co se týče rozdílu nebo vztahu mezi mikroslužbami a <abbr title="Service Oriented Architecture">SOA</abbr>, tak mikroslužby jsou typem SOA, který jasně definuje způsob, jak mají být hranice služeb vymezovány.

### Výhody a nevýhody architektury
| :heavy_check_mark: Výhody | :heavy_multiplication_x: Nevýhody |
|---------------------------|-----------------------------------|
| Nezávislost služeb | **Eventuální konzistence systému** <br/>= Vzhledem k asynchronnímu posílání zpráv mezi službami přes síť nebo použití event sourcingu, tak systém jako celek bude mít konzistentní stav (data v databázích) až po nějakém čase, ale nikdy to nebude okamžitě. |
| Škálovatelnost a elasticita | Vyšší nároky na definici domény (např. pro minimalizaci potřeby změn kontraktů mezi službami) |
| Flexibilita při vývoji | **Integrační testování je složitější** <br/>= Protože je třeba řešit více služeb a relevantní infrastrukturu (např. MQ nebo secret store) |
| **Polyglot systém** <br/>= Vývojáři nejsou svázáni k jednomu programovacímu jazyku nebo databázové technologii. | Logování a trasování je důležitější a složitější |
| Odolnost |  |
| Snazší využití nových technologií |  |

### Pojmy používané v rámci architektury mikroslužeb
- Publisher
- Subscriber
- Bounded context
- Domain
- Event

### Domény, kde se mikroslužby používají
- **Bankovní sektor** (fintech)
    - Příklad využití v této doméně lze vidět v sekci s business příkladem č. 1.
- **Streamovací služby**
    - [Netflix](https://www.nginx.com/blog/microservices-at-netflix-architectural-best-practices/) je jedním z příkladů adopce mikroslužeb pro postavení stremovací služby, která dosahuje vysoké dostupnosti a odolnosti, včetně 
- **...**
    - Příkladem je zde třeba [Uber](https://www.uber.com/en-CZ/blog/microservice-architecture/), kde použili mikroslužby pro řešení problémů jako závislosti mezi vývojářskými týmy nebo růst komplexity systému.

## Referenční model mikroslužeb
V této podkapitole je uveden referenční model architektury mikroslužeb. Tedy jde o obecný model komponent systému založených na dané architektuře.

![Microservice architecture reference model](../_images/reference_model.svg "Reference model of microservices")
- **Client Requests** - jde o dotazy od klientských aplikací na různé služby. Tyto dotazy mohou například být ve formě HTTP dotazů, ale závisí na architektuře API vrstvy.
- **API Layer** - Jde o jednotný bod pro přístup k službám v systému. Jde o implementaci Gateway vzoru. Výhodou tohoto přístupu je centrální řízení autentizace a autorizace klientů, dále v rámci této vrstvy může dojít ke cachování odpovědí na dotazy.
- **External Cache** - Jde o možnou komponentu, která není součástí API vrstvy, ale tato vrstva ji může využívat pro získání dočasných dat , jež by trvalo dlouho získat z příslušných systémů, resp. jejich databází.
- **Service** - Jde o celou mikroslužbu, přičemž nejde o proces, ale spíše jen o seskupení v rámci diagramu/modelu.
    - *Load balancer* - Jedná se o volitelný mechanismus pro řízení škálování a elasticity služby, kdy může existovat 1 až N služeb. Provoz bude vhodně posílán na instance/repliky, které mají volné vypočtení prostředky. Konkrétním příkladem toho nasazení je Kubernetes, kdy jednotlivé instance jsou tzv. pody a těm se dynamicky přiděluje provoz na základě jejich dostupnosti nebo vytížení.
    - *Service* (component) - Jde o konkrétní instanci služby.
        - Modul - Označuje in-process komponentu, resp. modul služby
    - *Database* - Může označovat <abbr title="Systém řízení báze dat">SŘBD</abbr>, databázi nebo databázové schéma, přičemž záleží, jestli byly služby logicky nebo fyzicky odděleny.
- **Message/Topic Queue** - Jde komponentu, která umožňuje realizovat asynchronní komunikaci mezi službami v systému.
    - Populárním přístupem je zde využití tzv. pub-sub vzoru, kdy některé služby jsou v roli vydavatele (`publisher`) nebo odběratele (`subscriber`).
    - Vydavatelé publikují události  s určitým tématem, přičemž na odběr daného tématu může být přihlášeno 0 až N odběratelů. Tedy pokud je služba přihlášena na odběr událostí specifického tématu, tak od <abbr title="Message Queue">MQ</abbr> dostane na příslušný koncový bod data v případě, že byla nějaká událost publikována.
    - Samozřejmě publikované události mohou být mohou být přijímány více odběrateli, přičemž většinou je garantováno jedno doručení zprávy (závisí, jak je <abbr title="Message Queue">MQ</abbr> nakonfigurována).
    - Příkladem této komponenty jsou tyto: Azure Service Bus, AWS Simple Queue Service

## Dokumentace architektury
