# import VizKG
import VizKG.visualize as VKG

sparql_query = """
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?docStr (COUNT(?component) as ?componentCount)
WHERE {
  ?doc a o:Peraturan .
  ?component o:bagianDari* ?doc .
  BIND(REPLACE(REPLACE(STR(?doc), "https://example.org/lex2kg/", ""), "/", "-") as ?docStr) .
}
GROUP BY ?docStr
"""

url = "http://127.0.0.1:3030/tes2/sparql"
bubble = VKG(sparql_query=sparql_query, sparql_service_url=url, chart='BarChart')
bubble.plot()