# import VizKG
import VizKG.visualize as VKG

sparql_query = """
# select 10 legal document dengan pasal terbanyak
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?docStr (COUNT(?pasal) as ?pasalCount)
WHERE {
  ?doc a legal:Peraturan .
  ?doc legal:pasal ?pasal .
  BIND(REPLACE(REPLACE(STR(?doc), "http://example.org/legal/peraturan/", ""), "/", "-") as ?docStr) .
}
GROUP BY ?docStr
ORDER BY DESC(?pasalCount)
LIMIT 25
"""

url = "http://127.0.0.1:3030/legal/sparql"
bubble = VKG(sparql_query=sparql_query, sparql_service_url=url, chart='BubbleChart')