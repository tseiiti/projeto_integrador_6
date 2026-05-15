# primeira execução

| modelo | tamanho | parâmetro | tempo | comprimento | opnião |
|:---|:---:|:---:|:---:|:---:|---:|
| gemma2:2b            | 1.52GB | 2.6B    | 15   | 797  | inglês          |
| gemma3:1b            | 0.76GB | 999.89M | 41   | 586  | inglês          |
| gemma3:4b            | 3.11GB | 4.3B    | 171  | 868  | ok              |
| phi3.5:3.8b          | 2.03GB | 3.8B    | 543  | 5738 | alucinou        |
| phi4-mini:3.8b       | 2.32GB | 3.8B    | 234  | 1469 | ótimo           |
| qwen2.5:0.5b         | 0.37GB | 494.03M | 50   | 807  | errado          |
| qwen2.5:1.5b         | 0.92GB | 1.5B    | 115  | 1760 | ruim            |
| qwen2.5:3b           | 1.80GB | 3.1B    | 204  | 1003 | médio           |
| qwen3:0.6b           | 0.49GB | 751.63M | 98   | 481  | ok              |
| qwen3:1.7b           | 1.27GB | 2.0B    | 158  | 961  | médio           |
| qwen3:4b             | 2.33GB | 4.0B    | 511  | 1410 | bom             |
| qwen3.5:2b           | 2.55GB | 2.3B    | 515  | 626  | ok              |
| qwen3.5:4b           | 3.16GB | 4.7B    | 1320 | 1059 | ok              |
| llama3:8b            | 4.34GB | 8.0B    | 486  | 794  | ok              |
| llama3.2:3b          | 1.88GB | 3.2B    |      |      |                 |
| mistral:7b           | 4.07GB | 7.2B    | 509  | 1767 | inglês          |
| lfm2.5-thinking:1.2b | 0.68GB | 1.2B    | 69   | 611  | inglês          |
| gemma3:270m          | 0.27GB | 268.10M | 25   | 244  | ruim            |
| llama2:7b            | 3.56GB | 7B      | 563  | 1600 | inglês          |
| qwen3.5:0.8b         | 0.96GB | 873.44M | 657  | 0    | sem resposta    |
| smollm:135m          | 0.09GB | 134.52M |      |      |                 |
| smollm:360m          | 0.21GB | 361.82M |      |      |                 |
| smollm:1.7b          | 0.92GB | 1.7B    |      |      |                 |
| smollm2:135m         | 0.25GB | 134.52M |      |      |                 |
| smollm2:360m         | 0.68GB | 361.82M |      |      |                 |
| smollm2:1.7b         | 1.70GB | 1.7B    |      |      |                 |

**(db: 6s)**

---

# segunda execução
| modelo | tamanho | parâmetro | tempo | comprimento | opnião |
|:---|:---:|:---:|:---:|:---:|---:|
| gemma2:2b            | 1.52GB | 2.6B    | 140  | 838  | ok              |
| gemma3:1b            | 0.76GB | 999.89M | 47   | 507  | simples         |
| gemma3:4b            | 3.11GB | 4.3B    | 194  | 1054 | bom             |
| phi3.5:3.8b          | 2.03GB | 3.8B    | 419  | 2178 | longo pequenos erros |
| phi4-mini:3.8b       | 2.32GB | 3.8B    | 248  | 1136 | ótimo           |
| qwen2.5:0.5b         | 0.37GB | 494.03M | 58   | 1098 | interessante erros |
| qwen2.5:1.5b         | 0.92GB | 1.5B    | 106  | 743  | simples         |
| qwen2.5:3b           | 1.80GB | 3.1B    | 206  | 915  | ok 2p           |
| qwen3:0.6b           | 0.49GB | 751.63M | 107  | 592  | simples         |
| qwen3:1.7b           | 1.27GB | 2.0B    | 158  | 679  | ok think        |
| qwen3:4b             | 2.33GB | 4.0B    | 547  | 1081 | muito bom       |
| qwen3.5:2b           | 2.55GB | 2.3B    | 635  | 1268 | bom             |
| qwen3.5:4b           | 3.16GB | 4.7B    | 1532 | 1060 | bom             |
| llama3:8b            | 4.34GB | 8.0B    | 649  | 967  | bom             |
| llama3.2:3b          | 1.88GB | 3.2B    | 240  | 865  | ok              |
| mistral:7b           | 4.07GB | 7.2B    | 585  | 2267 | completo longo  |
| lfm2.5-thinking:1.2b | 0.68GB | 1.2B    | 71   | 526  | simples think   |
| gemma3:270m          | 0.27GB | 268.10M | 30   | 624  | inglês          |
| llama2:7b            | 3.56GB | 7B      | 582  | 1662 | inglês          |
| qwen3.5:0.8b         | 0.96GB | 873.44M | 427  | 0    | sem resposta    |
| smollm:135m          | 0.09GB | 134.52M | 9    | 321  | alucinou        |
| smollm:360m          | 0.21GB | 361.82M | 24   | 2283 | inglês          |
| smollm:1.7b          | 0.92GB | 1.7B    | 53   | 101  | inglês alucinou |
| smollm2:135m         | 0.25GB | 134.52M | 29   | 1094 | inglês          |
| smollm2:360m         | 0.68GB | 361.82M | 60   | 1438 | inglês          |
| smollm2:1.7b         | 1.70GB | 1.7B    | 155  | 587  | inglês          |

**(db: 5s)**

---

# terceira execução
| modelo | tamanho | parâmetro | tempo | comprimento | opnião |
|:---|:---:|:---:|:---:|:---:|---:|
| gemma2:2b            | 1.52GB | 2.6B    | 146  | 720  | simples         |
| gemma3:1b            | 0.76GB | 999.89M | 211  | 679  | simples         |
| gemma3:4b            | 3.11GB | 4.3B    | 377  | 1233 | bom             |
| phi3.5:3.8b          | 2.03GB | 3.8B    | 1056 | 2860 | interessante 4p |
| phi4-mini:3.8b       | 2.32GB | 3.8B    | 1084 | 1616 | muito bom 4p    |
| qwen2.5:0.5b         | 0.37GB | 494.03M | 337  | 1088 | bom estruturado |
| qwen2.5:1.5b         | 0.92GB | 1.5B    | 563  | 1627 | bom 4p          |
| qwen2.5:3b           | 1.80GB | 3.1B    | 583  | 737  | ok              |
| qwen3:0.6b           | 0.49GB | 751.63M | 559  | 465  | simples         |
| qwen3:1.7b           | 1.27GB | 2.0B    | 603  | 677  | ok              |
| qwen3:4b             | 2.33GB | 4.0B    | 1329 | 1002 | ok              |
| qwen3.5:2b           | 2.55GB | 2.3B    | 1466 | 1144 | bom             |
| qwen3.5:4b           | 3.16GB | 4.7B    | 1146 | 1114 | bom             |
| llama3:8b            | 4.34GB | 8.0B    | 1226 | 895  | bom             |
| llama3.2:3b          | 1.88GB | 3.2B    | 743  | 980  | ok              |
| mistral:7b           | 4.07GB | 7.2B    | 743  | 1185 | ótimo           |
| lfm2.5-thinking:1.2b | 0.68GB | 1.2B    | 644  | 515  | simples think   |
| gemma3:270m          | 0.27GB | 268.10M | 199  | 870  | inglês          |
| llama2:7b            | 3.56GB | 7B      | 650  | 2213 | inglês          |
| qwen3.5:0.8b         | 0.96GB | 873.44M | 1267 | 0    | sem resposta    |
| smollm:135m          | 0.09GB | 134.52M | 208  | 568  | alucinou        |
| smollm:360m          | 0.21GB | 361.82M | 383  | 1641 | inglês          |
| smollm:1.7b          | 0.92GB | 1.7B    | 802  | 3716 | inglês          |
| smollm2:135m         | 0.25GB | 134.52M | 568  | 1292 | zuado           |
| smollm2:360m         | 0.68GB | 361.82M | 474  | 1912 | inglês          |
| smollm2:1.7b         | 1.70GB | 1.7B    | 612  | 530  | simples         |

**(db: 4s)**

---

# quarta execução
| modelo | tamanho | parâmetro | tempo | comprimento | opnião |
|:---|:---:|:---:|:---:|:---:|---:|
| gemma2:2b            | 1.52GB | 2.6B    | 307  | 929  | ok              |
| gemma3:1b            | 0.76GB | 999.89M | 347  | 651  | simples         |
| gemma3:4b            | 3.11GB | 4.3B    | 988  | 1176 | bom             |
| phi3.5:3.8b          | 2.03GB | 3.8B    | 1199 | 1104 | bom             |
| phi4-mini:3.8b       | 2.32GB | 3.8B    | 674  | 2436 | ótimo 4p        |
| qwen2.5:0.5b         | 0.37GB | 494.03M | 203  | 677  | simples         |
| qwen2.5:1.5b         | 0.92GB | 1.5B    | 704  | 1273 | médio 4p        |
| qwen2.5:3b           | 1.80GB | 3.1B    | 637  | 971  | ok              |
| qwen3:0.6b           | 0.49GB | 751.63M | 498  | 572  | simples         |
| qwen3:1.7b           | 1.27GB | 2.0B    | 1018 | 715  | simples         |
| qwen3:4b             | 2.33GB | 4.0B    | 859  | 1019 | bom             |
| qwen3.5:2b           | 2.55GB | 2.3B    | 1385 | 1516 | bom             |
| qwen3.5:4b           | 3.16GB | 4.7B    | 1380 | 1117 | bom             |
| llama3:8b            | 4.34GB | 8.0B    | 1041 | 780  | ok              |
| llama3.2:3b          | 1.88GB | 3.2B    | 470  | 1219 | bom             |
| mistral:7b           | 4.07GB | 7.2B    | 1060 | 1969 | bom estruturado |
| lfm2.5-thinking:1.2b | 0.68GB | 1.2B    | 287  | 557  | simples think   |
| gemma3:270m          | 0.27GB | 268.10M | 32   | 1855 | inglês          |
| llama2:7b            | 3.56GB | 7B      | 1233 | 2137 | inglês          |
| qwen3.5:0.8b         | 0.96GB | 873.44M | 3530 | 0    | sem resposta    |
| smollm:135m          | 0.09GB | 134.52M | 180  | 433  | alucinou        |
| smollm:360m          | 0.21GB | 361.82M | 23   | 1724 | inglês alucinou |
| smollm:1.7b          | 0.92GB | 1.7B    | 57   | 104  | inglês alucinou |
| smollm2:135m         | 0.25GB | 134.52M | 36   | 1683 | pouco estranho  |
| smollm2:360m         | 0.68GB | 361.82M | 61   | 1615 | inglês          |
| smollm2:1.7b         | 1.70GB | 1.7B    | 174  | 1119 | inglês          |

**(db: 5s)**