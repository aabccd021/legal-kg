# import VizKG
import VizKG.visualize as VKG

sparql_query = """
# select 10 legal document dengan pasal terbanyak
PREFIX lex2kg-o: <https://example.org/lex2kg/ontology/>

SELECT ?docStr (COUNT(?pasal) as ?pasalCount)
WHERE {
  ?doc a lex2kg-o:Peraturan .
  ?doc lex2kg-o:pasal ?pasal .
  BIND(REPLACE(REPLACE(STR(?doc), "https://example.org/lex2kg/", ""), "/", "-") as ?docStr) .
}
GROUP BY ?docStr
ORDER BY DESC(?pasalCount)
LIMIT 25
"""

url = "http://127.0.0.1:3030/lex2kg/sparql"
bubble = VKG(sparql_query=sparql_query, sparql_service_url=url, chart='PieChart')