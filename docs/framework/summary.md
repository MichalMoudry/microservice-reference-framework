# Souhrn
---
Zde je uvedena poslední část Rámce, která obsahuje spojení mezi charakteristikami mikroslužeb a konkrétními příklady (z reálných projektů nebo ukázkové aplikace). Dále je zde uveden seznam pokročilých témat v oblasti mikroslužeb pro další výuku/posun v této architektuře.

## Spojení charakteristik mikroslužeb s praxí
### Rozdělení systému na komponenty ve formě služeb
Systémy založené na architektuře mikroslužeb jsou složeny z několika služeb/komponent, které nejsou in-process a pokrávají celý technologický stack (<abbr title="Uživatelské rozhraní">UI</abbr>, business logika, persistence dat). Toto rozdělení bývá na základě částí domény, které tyto služby mají pokrývat a lze také organizovat vývojářský tým okolo těchto částí domén nebo služeb (tzn. tým je odpovědný za určitou množinu služeb v systému).

Výhodou tohoto rozdělení mimo dekompozice systému na menší celky je také možnost nezávisle služby nasazovat (mimo případy ve změnách kontraktů). Samozřejmě toto rozdělení přináší komplikace v případě, kdy služby komunikují mezi sebou nebo existuje transakce, která jde přes více než jednu službu.

> Další aspekty (např. zvýšení spokojenosti a produktivity vývojářů) rozdělení systému byly diskutovány v [business případu č. 1](/framework/business-cases?id=business-případ-1).
#### Nezávislost služeb a nezávislé nasazování
Jak bylo zmíněno, tak jednotlivé služby jsou vymezené do oddělených celků (out-of-process komponenty), přičemž jejich oddělení umožňuje nasazovat služby nezávisle na ostatních (jen v případě změn v kontraktech je třeba dodatečná koordinace). Výhodou nezávislých služeb a jejich nasazování je větší rychlost a flexibilita v implementaci nových funkcí. Tyto atributy byly mezi hlavními důvody, proč v rámci [business případu 1](/framework/business-cases?id=business-případ-1) došlo k přesunu z monolitické architektury na mikroslužby.

> Nezávislé nasazení služeb lze vidět na [praktickém projektu](/framework/on-hands-project), kdy lze nasadit jednotlivé služby bez ohledu na stav ostatních služeb.

Nezávislost služeb má dopad na komunikaci mezi jednotlivými komponentami. Zde lze využít synchronní nebo asynchronní způsob komunikace.
- Synchronní komunikace - způsob komunikace, kdy služba volá druhou službu přímo a tvoří API chain.
- Asynchronní komunikace - způsob komunikace, kdy pro komunikaci mezi 1 až _N_ službami je využita fronta pro posílání zpráv (tzn. služby nikdy nekomunikují spoluj přímo). Příklad této komunikace lze vidět zde:
    - Business případ 1
    - Praktický projekt

### Automatizace infrastruktury
Automatizace infrastruktury může mít několik podob, a to třeba automatizace nasazení, škálování nebo správa služeb. Tedy lze nasadit různé přístupy (např. praktika DevOps) a prostředky (Kubernetes, GitHub Action, Azure DevOps Pipelines) pro dosažení efektivní automatizace softwarových řešení.

Co se týče konkrétních ukázek automatizace, tak v uvedeném [business příkladě 1](/framework/business-cases?id=business-případ-1) lze vidět, že vývojářský tým využil technologii Kubernetes pro automatizaci nasazení a škálování služeb. Další praktická ukázka je uvedena v [podkapitole části Praktický projekt](/framework/on-hands-project?id=automatizace-infrastruktury), kde je popsán proces nasazení a jeho implementace pro jednu službu v demonstračním projektu. V ukázkovém procesu lze vidět definici potřebných činností (nahrání Docker obrazu do registráře, migrace databázového schématu aj.) pro nasazení jedné služby.
### Decentralizovaný governance a správa dat
Každá služba vlastní svoje data a s nikým jiným je nesdílí. Tedy v rámci mikroslužeb budou decentralizovány rozhodnutí ohledně zvolených technologiích pro uložiště a návrhu datového modelu. Výhodou je zde zvolení technologií pro ukládání dat, které se nejlépe hodí pro konkrétní účely služeb. Konkrétní případ využití různorodých technologií pro uložiště lze vidět v důvodech pro využití mikroslužeb v rámci [business příkladu 1](/framework/business-cases?id=důvod-pro-využití-mikroslužeb).
### Chytré koncové body s jednoduchými komunikačními kanály
V rámci praktického projektu lze vidět tuto charkteristiku na příkladu se smazáním uživatele v systému, kdy jedna služba publikuje událost obsahující ID smazaného uživatele. Samotná komunikace mezi službami je jednoduchá, přičemž jedna služba publikuje data do <abbr title="Message Queue">MQ</abbr> komponenty, následně se MQ pokusí odeslat daná data v určeném formátu (čistá/raw data nebo třeba v `cloudevents` formátu) službám, které jsou přihlášeny na odběr události smazání uživatele. Ukázka `cloudevents` formátu lze vidět níže. Tedy webová služba dostane na svůj endpoint HTTP request, jehož tělo obsahuje publikovaná data (v tomto případě jde o ID smazaného uživatele).

```json
{
    "data": "VGJDmp2VmuIt2HM9c1Qc1T7Li992",
    "datacontenttype": "application/json",
    "id": "e2e0f099-6b7f-4a00-a549-bd5a4366a66d",
    "pubsubname": "mrf-pub-sub",
    "source": "user-service",
    "specversion": "1.0",
    "time": "2023-11-16T12:49:53Z",
    "topic": "user-delete",
    "traceid": "00-f9a224367f5cd4694210021220bc9a68-c74f791fd741165b-01",
    "traceparent": "00-f9a224367f5cd4694210021220bc9a68-c74f791fd741165b-01",
    "tracestate": "",
    "type": "com.dapr.event.sent"
}
```
Ve výsledku komunikace mezi komponentami probíhá pomocí definovaného protokolu (např. HTTP) ve styli request-response a veškerá logika je řešena na straně služeb. Není tedy třeba využívat mechanismy nebo komponenty (např. <abbr title="Enterprise Service Bus">ESB</abbr>), které by řešily logiku v rámci komunikační části systému.

## Pokročilá témata
### Saga pattern
Jak bylo v charateristikách architektury zmíněno, tak Saga pattern je vzor, resp. algoritmus, jehož účel je řešit problémy spojené s rozsáhlými transakcemi (tzv. Long Lived Transactions). Saga pattern je o rozdělení velké transkace na několik dílčích, kdy v kontextu mikroslužeb může jít o transakce na oddělených službách. 

Problém zde spočívá v implementaci těchto transakcí, tedy je dobré se podívat po další literatuře zabývající se touto problematikou.
- Např.: [Azure Architecture Center - Saga distributed transactions pattern](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)

### Event sourcing
Jde o přístup k modelování dat v systémech, který je založen na ukládání událostí v systému namísto objektů v rámci jeho domény. Tyto události dohromady dávají stav SW systému.
> Event sourcing je často používán v kombinaci se <abbr title="Command Query Responsibility Separation">CQRS</abbr> patternem nebo mikroslužbami.

Analogií pro události v rámci Event sourcingu mohou být účetní transakce, které zaznamenávají změny na účtech. Balance na účtech je ve výsledku (tzn. ve stavu) suma všech změn na účtu.

Základ této myšlenky, resp. přístupu k modelování není výrazně komplikovaný, ale efektivní implementace/využití v reálných systémech (např. správné určení frekvence tzv. rolling snapshotů) je komplikovaným tématem. To je také doplněno o to, že databáze pro Event sourcing nejsou SQL ani NoSQL databáze, tedy je vhodné projít si literaturu, která se touto problématikou částečně nebo kompletně zabývá (např. kniha [Microservices: Up and Running](https://implementing-microservices.github.io/)).
