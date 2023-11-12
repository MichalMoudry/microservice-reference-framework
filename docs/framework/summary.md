# Souhrn
---
Zde je uvedena poslední část Rámce, která obsahuje spojení mezi charakteristikami mikroslužeb a konkrétními příklady (z reálných projektů nebo ukázkové aplikace). Dále je zde uveden seznam pokročilých témat v oblasti mikroslužeb pro další výuku/posun v této architektuře.

## Spojení charakteristik
### Rozdělení systému na komponenty za pomoci služeb
### Organizace okolo business funkcí, resp. domén
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
