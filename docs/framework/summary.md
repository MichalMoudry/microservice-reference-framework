# Souhrn
---
Zde je uvedena poslední část Rámce, která obsahuje spojení mezi charakteristikami mikroslužeb a konkrétními příklady (z reálných projektů nebo ukázkové aplikace). Dále je zde uveden seznam pokročilých témat v oblasti mikroslužeb pro další výuku/posun v této architektuře.

## Spojení charakteristik mikroslužeb s praxí
### Rozdělení systému na komponenty za pomoci služeb
### Nezávislost služeb a nezávislé nasazování
### Automatizace infrastruktury
### Decentralizovaný governance a správa dat
### Design orientovaný na odolnost a chyby
### Chytré koncové body s jednoduchými komunikačními kanály

## Pokročilá témata
### Saga pattern
Jak bylo v charateristikách architektury zmíněno, tak Saga pattern je vzor, resp. algoritmus, jehož účel je řešit problémy spojené s rozsáhlými transakcemi (tzv. Long Lived Transactions). Saga pattern je o rozdělení velké transkace na několik dílčích, kdy v kontextu mikroslužeb může jít o transakce na oddělených službách. 

Problém zde spočívá v implementaci těchto transakcí, tedy je dobré se podívat po další literatuře zabývající se touto problematikou.
- Např.: [Azure Architecture Center - Saga distributed transactions pattern](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)

### Event sourcing
Jde o přístup k modelování dat v systémech, který je založen na ukládání událostí v systému namísto objektů v rámci jeho domény. Tyto události dohromady dávají stav SW systému.
> Event sourcing je populární v kombinaci se <abbr title="Command Query Responsibility Separation">CQRS</abbr> patternem nebo mikroslužbami.

Analogií pro události v rámci Event sourcingu mohou být účetní transakce, které zaznamenávají změny na účtech. Balance na účtech je ve výsledku (tzn. ve stavu) suma všech změn na účtu.

Základ této myšlenky, resp. přístupu k modelování není výrazně komplikovaný, ale efektivní implementace/využití v reálných systémech (např. správné určení frekvence tzv. rolling snapshotů) je komplikovaným tématem. To je také doplněno o to, že databáze pro Event sourcing nejsou SQL ani NoSQL databáze, tedy je vhodné projít si literaturu, která se touto problématikou částečně nebo kompletně zabývá (např. kniha [Microservices: Up and Running](https://implementing-microservices.github.io/)).
