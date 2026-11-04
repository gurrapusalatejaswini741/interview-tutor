import { NlpTopic } from '../types';

export const NLP_TOPICS: NlpTopic[] = [
  {
    id: 1,
    title: '1. Introduction to Natural Language Processing',
    category: 'Foundations',
    description: 'NLP bridges computer science, artificial intelligence, and computational linguistics to enable software to parse, understand, interpret, and generate human language.',
    realWorldUse: 'Search engines (Google), virtual assistants (Siri, Alexa), machine translation (Google Translate), spam detection, and conversational AI.',
    pythonCode: `# Basic string operations & regular expressions in NLP
import re

text = "Welcome to AI Interview Mentor! Let's master NLP in 2026."
# Lowercase normalization
clean_text = text.lower()
# Clean punctuation using regex
words = re.findall(r'\\b[\\w\\d]+\\b', clean_text)
print("Normalized vocabulary:", words)`,
    interviewQuestions: [
      {
        q: 'What makes natural language processing inherently challenging compared to programming language parsing?',
        a: 'Ambiguity (syntactic, semantic, pragmatic), context dependency, polysemy (words with multiple meanings), sarcasm, cultural nuances, and idioms make natural languages far less deterministic than formal grammars.',
      },
    ],
    exercise: 'Identify three examples of syntactic ambiguity in common English phrases (e.g., "I saw the man with the telescope").',
    quiz: [
      {
        id: 'q1-1',
        question: 'Which of the following is NOT a primary challenge in NLP?',
        options: ['Lexical ambiguity', 'Pragmatics and sarcasm', 'Fixed static mathematical syntax', 'Polysemy'],
        correctAnswerIndex: 2,
        explanation: 'Natural human languages do not have fixed static mathematical syntax; they evolve organically with fluid context.',
      },
    ],
  },
  {
    id: 2,
    title: '2. Text Preprocessing & Cleaning',
    category: 'Foundations',
    description: 'Text preprocessing transforms messy, unstructured real-world text into a clean, uniform format suitable for vectorization and machine learning models.',
    realWorldUse: 'Stripping HTML tags from web scrapers, eliminating unicode noise, normalising accents, converting currency symbols, and handling contractions.',
    pythonCode: `import re
import html

def preprocess_text(raw_html):
    # Decode HTML entities
    unescaped = html.unescape(raw_html)
    # Strip HTML tags
    no_html = re.sub(r'<[^>]+>', ' ', unescaped)
    # Remove URLs
    no_urls = re.sub(r'https?://\\S+|www\\.\\S+', '', no_html)
    # Normalize whitespaces and lowercase
    cleaned = re.sub(r'\\s+', ' ', no_urls).strip().lower()
    return cleaned

sample = "<p>Check out our <b>API</b> at https://api.mentor.ai &amp; practice!</p>"
print(preprocess_text(sample))`,
    interviewQuestions: [
      {
        q: 'When should you NOT lowercase all text during preprocessing?',
        a: 'When performing Named Entity Recognition (NER), Sentiment Analysis with casing indicators (e.g., "GREAT" vs "great"), or Part-of-Speech tagging where capital letters help distinguish proper nouns like "Apple" (the company) from "apple" (the fruit).',
      },
    ],
    exercise: 'Write a regex pattern that matches and extracts all email addresses and phone numbers from a user profile.',
    quiz: [
      {
        id: 'q2-1',
        question: 'Why might aggressive stopword removal hurt modern Transformer models like BERT?',
        options: ['Stopwords take too much RAM', 'Transformers rely on attention across all surrounding context words including prepositions', 'BERT cannot tokenize stopwords', 'Stopwords have high TF-IDF values'],
        correctAnswerIndex: 1,
        explanation: 'Self-attention calculates token-to-token relationships. Removing words like "not", "between", or "to" alters syntactic meaning and spatial logic.',
      },
    ],
  },
  {
    id: 3,
    title: '3. Tokenization (Word, Subword & Byte-Pair Encoding)',
    category: 'Foundations',
    description: 'Tokenization splits continuous text streams into discrete semantic units (tokens). Modern LLMs use subword tokenization (BPE, WordPiece, Unigram) to solve Out-Of-Vocabulary (OOV) problems.',
    realWorldUse: 'GPT tokenizers (cl100k_base), BERT WordPiece, Llama SentencePiece, and code compilation.',
    pythonCode: `# Demonstrating basic character vs word vs subword concept
text = "unbelievable tokenization"

# Simple whitespace tokenization
word_tokens = text.split()

# Byte-Pair Encoding conceptually pairs frequent subwords:
# 'un' + 'believ' + 'able'
subword_sample = ['un', '##believ', '##able', 'token', '##ization']
print("Subword units:", subword_sample)`,
    interviewQuestions: [
      {
        q: 'How does Byte-Pair Encoding (BPE) solve the Out-Of-Vocabulary (OOV) issue in modern LLMs?',
        a: 'BPE iteratively merges the most frequent pairs of adjacent bytes or characters. If an unknown word appears at test time, it decomposes into known subword fragments (down to individual bytes/characters), ensuring zero OOV tokens.',
      },
    ],
    exercise: 'Trace how BPE iteratively tokenizes the word "lowest" given an initial vocabulary of letters.',
    quiz: [
      {
        id: 'q3-1',
        question: 'Which tokenization method is primarily used in OpenAI GPT models?',
        options: ['Word-level whitespace', 'Byte-level Byte-Pair Encoding (BPE)', 'Regex only', 'Character-level only'],
        correctAnswerIndex: 1,
        explanation: 'GPT models employ Byte-level BPE (tiktoken) which maps any utf-8 byte sequence into subword tokens.',
      },
    ],
  },
  {
    id: 4,
    title: '4. Stop-Word Removal',
    category: 'Foundations',
    description: 'Stop words are high-frequency words ("the", "is", "at", "which") that carry little distinguishing domain information in classical information retrieval and search ranking.',
    realWorldUse: 'Search engines index optimization, topic modeling (LDA), and classical TF-IDF classification.',
    pythonCode: `english_stopwords = {
    'i', 'me', 'my', 'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in'
}

sentence = "The candidate is answering an interview question in python"
tokens = sentence.lower().split()
filtered = [w for w in tokens if w not in english_stopwords]
print("Filtered tokens:", filtered) # ['candidate', 'answering', 'interview', 'question', 'python']`,
    interviewQuestions: [
      {
        q: 'In what NLP task could removing stop words completely invert the prediction?',
        a: 'Sentiment analysis or negation detection! Removing "not" from "The service was not good" produces "service good", turning a negative sentiment into positive.',
      },
    ],
    exercise: 'Implement a customizable stop-word filter that preserves sentiment negation terms like "not", "never", "no", "neither".',
    quiz: [
      {
        id: 'q4-1',
        question: 'Stop-word removal is most useful in which of the following?',
        options: ['BERT language generation', 'Classical TF-IDF keyword search ranking', 'Speech synthesis audio synthesis', 'Grammar correction tools'],
        correctAnswerIndex: 1,
        explanation: 'TF-IDF search and document retrieval benefit from filtering words that appear indiscriminately across all documents.',
      },
    ],
  },
  {
    id: 5,
    title: '5. Stemming and Lemmatization',
    category: 'Linguistics & Syntax',
    description: 'Stemming strips word affixes using heuristic rule-based cutoffs (e.g. Porter Stemmer: "studies" -> "studi"). Lemmatization uses morphological vocabularies and POS tags to return the true canonical dictionary root (lemma: "studies" -> "study").',
    realWorldUse: 'Search query matching, document clustering, indexing word variants across legal or medical texts.',
    pythonCode: `# Stemming vs Lemmatization conceptual implementation
def simple_suffix_stem(word):
    for suffix in ['ing', 'ly', 'ed', 'ies', 'es', 's']:
        if word.endswith(suffix) and len(word) > len(suffix) + 2:
            return word[:-len(suffix)]
    return word

# Stemmer cuts heuristically: 'changing' -> 'chang'
# Lemmatizer with POS verb knows 'changing' -> 'change', 'better' -> 'good'
print("Stemmed:", simple_suffix_stem("running")) # run
print("Stemmed:", simple_suffix_stem("changing")) # chang (stem) vs 'change' (lemma)`,
    interviewQuestions: [
      {
        q: 'What is the key algorithmic difference between the Porter Stemmer and WordNet Lemmatizer?',
        a: 'The Porter Stemmer applies a cascade of regex-like heuristic string trimming rules without checking dictionary validity. WordNet Lemmatizer uses a lexical database and requires the Part-of-Speech (POS) to look up the valid morphological base form.',
      },
    ],
    exercise: 'Compare how "better" is processed by a stemmer vs lemmatizer with ADJ part of speech.',
    quiz: [
      {
        id: 'q5-1',
        question: 'What is the lemma of "was" when parsed as a Verb?',
        options: ['was', 'were', 'be', 'been'],
        correctAnswerIndex: 2,
        explanation: 'The base dictionary lemma of "was" as a verb is "be".',
      },
    ],
  },
  {
    id: 6,
    title: '6. Part-of-Speech (POS) Tagging',
    category: 'Linguistics & Syntax',
    description: 'POS tagging assigns grammatical labels (noun, verb, adjective, preposition) to each token based on both its definition and its syntactic relationship with adjacent words.',
    realWorldUse: 'Disambiguating homographs in Text-to-Speech (e.g., "record" as NOUN vs VERB), parsing questions, grammar checking.',
    pythonCode: `# POS Tagging example
# Penn Treebank tagset: NN (Noun), VBZ (Verb 3rd person), JJ (Adjective)
sample_tags = [
    ("Arjun", "NNP"),       # Proper noun
    ("conducts", "VBZ"),    # Verb
    ("a", "DT"),            # Determiner
    ("rigorous", "JJ"),     # Adjective
    ("interview", "NN")     # Noun
]
for word, tag in sample_tags:
    print(f"{word:12} -> {tag}")`,
    interviewQuestions: [
      {
        q: 'Why are Hidden Markov Models (HMM) and Conditional Random Fields (CRF) effective for POS tagging?',
        a: 'They model sequence transitions: the probability of a word being a Verb depends not only on the word itself, but on the previous tag (e.g., a Noun or Pronoun is much more likely to precede a Verb than another Determiner).',
      },
    ],
    exercise: 'Tag the sentence: "Time flies like an arrow, but fruit flies like a banana."',
    quiz: [
      {
        id: 'q6-1',
        question: 'In Penn Treebank notation, what does the tag "JJ" stand for?',
        options: ['Conjunction', 'Adjective', 'Noun', 'Adverb'],
        correctAnswerIndex: 1,
        explanation: 'JJ denotes an adjective in the standard Penn Treebank POS tag hierarchy.',
      },
    ],
  },
  {
    id: 7,
    title: '7. Named Entity Recognition (NER)',
    category: 'Linguistics & Syntax',
    description: 'NER locates and categorizes entities in unstructured text into predefined classes such as person names, organizations, locations, monetary amounts, and timestamps.',
    realWorldUse: 'Resume parsing (extracting university, past companies, skills), financial invoice analysis, medical record information extraction.',
    pythonCode: `# NER extraction example
entities_mock = [
    {"text": "Sundar Pichai", "label": "PERSON", "start": 0, "end": 13},
    {"text": "Google", "label": "ORG", "start": 21, "end": 27},
    {"text": "Mountain View", "label": "GPE", "start": 31, "end": 44},
    {"text": "2026", "label": "DATE", "start": 48, "end": 52}
]
print("Recognized Entities:", [(e['text'], e['label']) for e in entities_mock])`,
    interviewQuestions: [
      {
        q: 'What is the BIO (or IOB2) tagging scheme used in NER models?',
        a: 'B indicates Beginning of an entity, I indicates Inside (continuation) of a multi-word entity, and O indicates Outside any entity. For example: "New (B-LOC) York (I-LOC) City (I-LOC)".',
      },
    ],
    exercise: 'Tag "Microsoft CEO Satya Nadella announced new investments in Bangalore" using BIO notation.',
    quiz: [
      {
        id: 'q7-1',
        question: 'In BIO tagging, which tag marks the second word of a multi-word organization?',
        options: ['B-ORG', 'I-ORG', 'O', 'M-ORG'],
        correctAnswerIndex: 1,
        explanation: 'I-ORG represents the continuation ("Inside") of an organization entity.',
      },
    ],
  },
  {
    id: 8,
    title: '8. Bag of Words (BoW) Model',
    category: 'Vector Representations',
    description: 'Bag of Words represents text as a fixed-length vector counting token frequencies, disregarding word order and grammar while preserving token occurrences.',
    realWorldUse: 'Fast baseline text classification, document filtering, spam detection.',
    pythonCode: `from collections import Counter

docs = [
    "deep learning and natural language processing",
    "deep neural networks for vision"
]
vocab = sorted(list(set(" ".join(docs).split())))
print("Vocabulary:", vocab)

for doc in docs:
    counts = Counter(doc.split())
    vector = [counts[w] for w in vocab]
    print(f"BoW Vector for '{doc[:20]}...':", vector)`,
    interviewQuestions: [
      {
        q: 'What are the two biggest weaknesses of the Bag of Words representation?',
        a: '1. It discards word order and syntax completely ("not bad" has the same components as "bad not"). 2. It results in extremely sparse, high-dimensional vectors that suffer from the curse of dimensionality.',
      },
    ],
    exercise: 'Compute the BoW representation of 3 sentences and calculate their cosine similarity.',
    quiz: [
      {
        id: 'q8-1',
        question: 'What is the dimensionality of a Bag of Words vector representation?',
        options: ['Length of the document in words', 'Total size of the entire vocabulary', 'Always 128', 'Fixed at 300'],
        correctAnswerIndex: 1,
        explanation: 'Each slot in the vector corresponds to one unique token in the global vocabulary.',
      },
    ],
  },
  {
    id: 9,
    title: '9. Term Frequency - Inverse Document Frequency (TF-IDF)',
    category: 'Vector Representations',
    description: 'TF-IDF evaluates how important a word is to a document within a collection. TF rewards words that appear often in the document; IDF penalizes words that appear everywhere across the corpus.',
    realWorldUse: 'Search engine document relevance, keyword extraction, legal document indexing, document clustering.',
    pythonCode: `import math
from collections import Counter

def compute_tfidf(corpus):
    N = len(corpus)
    doc_tokens = [d.lower().split() for d in corpus]
    # Document frequency
    df = Counter()
    for tokens in doc_tokens:
        df.update(set(tokens))
    
    # Calculate TF-IDF for first document
    first_doc = doc_tokens[0]
    tf = Counter(first_doc)
    doc_len = len(first_doc)
    
    tfidf = {}
    for word, count in tf.items():
        term_tf = count / doc_len
        term_idf = math.log((N + 1) / (df[word] + 1)) + 1
        tfidf[word] = round(term_tf * term_idf, 4)
    return tfidf

sample_corpus = [
    "python data structures and algorithms in software engineering",
    "java backend spring boot microservices",
    "python machine learning and deep neural networks"
]
print("TF-IDF for doc 0:", compute_tfidf(sample_corpus))`,
    interviewQuestions: [
      {
        q: 'Why do we take the logarithm of (N / df) when calculating IDF?',
        a: 'The log dampens the impact of IDF. Without the logarithm, very rare terms would receive an astronomically high weight compared to slightly less rare terms, distorting vector balance.',
      },
    ],
    exercise: 'Calculate manual TF-IDF for the word "interview" in a corpus of 100 documents where it appears in 5 documents.',
    quiz: [
      {
        id: 'q9-1',
        question: 'If a word appears in every single document in a corpus, what does its IDF value approach?',
        options: ['Infinity', 'Zero (or minimum constant)', '100', 'Maximum weight'],
        correctAnswerIndex: 1,
        explanation: 'When df equals N, log(N/N) = log(1) = 0. The word carries no discriminatory value across documents.',
      },
    ],
  },
  {
    id: 10,
    title: '10. N-grams (Unigrams, Bigrams, Trigrams)',
    category: 'Vector Representations',
    description: 'An N-gram is a contiguous sequence of n items from a given text. Bigrams (n=2) and trigrams (n=3) capture local word order and phrase idioms missed by unigrams.',
    realWorldUse: 'Autocomplete suggestions, spell checking, sentiment phrases like "not happy", speech recognition language models.',
    pythonCode: `def generate_ngrams(text, n=2):
    tokens = text.split()
    return [' '.join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]

sentence = "artificial intelligence interview mentor simulator"
print("Bigrams:", generate_ngrams(sentence, 2))
print("Trigrams:", generate_ngrams(sentence, 3))`,
    interviewQuestions: [
      {
        q: 'What is the trade-off of increasing N from 2 to 5 in an N-gram language model?',
        a: 'Higher N captures longer context and richer phrasing, but suffers from exponential combinatorial explosion (sparsity), zero-frequency counts for unseen phrases, and requires smoothing techniques (Laplace, Kneser-Ney).',
      },
    ],
    exercise: 'Create a bigram language model that calculates transition probability P(w2 | w1).',
    quiz: [
      {
        id: 'q10-1',
        question: 'How many bigrams can be extracted from a sentence with 6 tokens?',
        options: ['6', '5', '4', '15'],
        correctAnswerIndex: 1,
        explanation: 'For a sentence of length k, there are k - n + 1 n-grams. For k=6 and n=2: 6 - 2 + 1 = 5 bigrams.',
      },
    ],
  },
  {
    id: 11,
    title: '11. Sentiment Analysis',
    category: 'Applications',
    description: 'Sentiment analysis computationally identifies and categorizes emotional polarity (positive, negative, neutral) and subjectivity expressed in source text.',
    realWorldUse: 'Customer review evaluation, brand monitoring on social media, candidate tone assessment, feedback summarization.',
    pythonCode: `# Sentiment polarity evaluation concept
def rule_sentiment(text):
    positives = {'excellent', 'great', 'confident', 'strong', 'mastered', 'proficient'}
    negatives = {'failed', 'weak', 'confused', 'poor', 'struggling', 'nervous'}
    
    words = text.lower().split()
    score = sum(1 for w in words if w in positives) - sum(1 for w in words if w in negatives)
    polarity = "positive" if score > 0 else "negative" if score < 0 else "neutral"
    return {"polarity": polarity, "net_score": score}

print(rule_sentiment("Candidate gave an excellent and confident response."))`,
    interviewQuestions: [
      {
        q: 'How do you handle sarcasm in sentiment analysis?',
        a: 'Sarcasm often pairs positive lexical words with negative contextual reality (e.g., "Oh great, another runtime null pointer!"). Resolving it requires deep transformer contextual representations, multimodal signals (voice tone/pitch), or conversational history.',
      },
    ],
    exercise: 'Write 3 sarcastic sentences that fool simple lexicon-based sentiment analyzers.',
    quiz: [
      {
        id: 'q11-1',
        question: 'Which method handles nuance and sarcasm best in modern NLP?',
        options: ['Lexicon count matching (VADER)', 'Contextual Transformer encoders (BERT/RoBERTa)', 'Naive Bayes on unigrams', 'Regex word filtering'],
        correctAnswerIndex: 1,
        explanation: 'Transformers capture long-range contextual dependencies and bidirectional attention across entire sentences.',
      },
    ],
  },
  {
    id: 12,
    title: '12. Text Classification Algorithms',
    category: 'Applications',
    description: 'Categorizing text into defined classes using supervised learning. From Naive Bayes and Logistic Regression to CNNs and fine-tuned Transformers.',
    realWorldUse: 'Spam classification, ticket routing, sentiment tagging, intent detection in conversational bots.',
    pythonCode: `# Naive Bayes log-likelihood classification sketch
import math

class SimpleNaiveBayes:
    def __init__(self):
        self.class_priors = {'tech': 0.5, 'hr': 0.5}
    def predict(self, text):
        tech_words = {'algorithm', 'complexity', 'c#', 'java', 'sql', 'memory'}
        hr_words = {'teamwork', 'leadership', 'conflict', 'strengths', 'goals'}
        tokens = set(text.lower().split())
        tech_hits = len(tokens.intersection(tech_words))
        hr_hits = len(tokens.intersection(hr_words))
        return "Technical" if tech_hits >= hr_hits else "HR"

nb = SimpleNaiveBayes()
print("Class:", nb.predict("Explain the time complexity of quicksort"))`,
    interviewQuestions: [
      {
        q: 'Why does Naive Bayes perform surprisingly well despite the "naive" conditional independence assumption?',
        a: 'Even though words are not truly independent, the decision boundary for classification requires only that the correct class score ranks highest, which often holds even when absolute probability estimates are poorly calibrated.',
      },
    ],
    exercise: 'Explain why Laplace smoothing is necessary in Naive Bayes when encountering an unseen word.',
    quiz: [
      {
        id: 'q12-1',
        question: 'What is the "naive" assumption in the Naive Bayes text classifier?',
        options: ['All sentences have identical length', 'All features (words) are conditionally independent given the class label', 'The vocabulary never changes', 'Grammar is always correct'],
        correctAnswerIndex: 1,
        explanation: 'It assumes that the presence or absence of a particular word is completely independent of the presence of any other word given the class label.',
      },
    ],
  },
  {
    id: 13,
    title: '13. Word Embeddings (Word2Vec, GloVe, FastText)',
    category: 'Vector Representations',
    description: 'Dense, continuous vector representations where words with similar semantic meanings are mapped to nearby points in high-dimensional space (e.g. 300 dimensions).',
    realWorldUse: 'Semantic search, recommendation engines, synonym lookup, vector math (King - Man + Woman = Queen).',
    pythonCode: `# Simulating word embedding cosine similarity in Python
import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    return dot / (norm1 * norm2) if norm1 and norm2 else 0.0

# Mock 3D embeddings
king = [0.85, 0.45, 0.90]
queen = [0.83, 0.48, 0.92]
apple = [0.12, 0.90, 0.15]

print("Sim(King, Queen):", round(cosine_similarity(king, queen), 4))
print("Sim(King, Apple):", round(cosine_similarity(king, apple), 4))`,
    interviewQuestions: [
      {
        q: 'What is the difference between Skip-Gram and Continuous Bag of Words (CBOW) in Word2Vec?',
        a: 'CBOW predicts the target word from surrounding context words (faster, better for frequent words). Skip-gram predicts the surrounding context words given the target word (slower, but excels at rare words and small datasets).',
      },
    ],
    exercise: 'Explain how FastText handles out-of-vocabulary words using character n-grams compared to Word2Vec.',
    quiz: [
      {
        id: 'q13-1',
        question: 'Which word embedding architecture utilizes character n-grams to represent subwords?',
        options: ['GloVe', 'Word2Vec', 'FastText', 'TF-IDF'],
        correctAnswerIndex: 2,
        explanation: 'FastText breaks words into character n-grams, enabling it to compute representations for previously unseen and misspelled words.',
      },
    ],
  },
  {
    id: 14,
    title: '14. Semantic Similarity & Vector Distance Metrics',
    category: 'Vector Representations',
    description: 'Measuring semantic relatedness between sentences or candidate answers and expected benchmark answers using Cosine Similarity, Dot Product, and Euclidean distance.',
    realWorldUse: 'Grading student exam answers automatically, duplicate question detection on Quora/StackOverflow, vector database search (FAISS/Pinecone).',
    pythonCode: `# Demonstrating semantic similarity between candidate and benchmark answer
def compute_overlap_similarity(candidate, benchmark):
    c_words = set(candidate.lower().split())
    b_words = set(benchmark.lower().split())
    jaccard = len(c_words.intersection(b_words)) / len(c_words.union(b_words))
    return round(jaccard * 100, 2)

cand = "Garbage collector frees unreferenced memory automatically"
bench = "Garbage collection in .NET recovers unreferenced heap objects"
print("Lexical Jaccard Overlap:", compute_overlap_similarity(cand, bench), "%")`,
    interviewQuestions: [
      {
        q: 'Why is Cosine Similarity preferred over Euclidean Distance for text embeddings?',
        a: 'Cosine similarity measures angular divergence, making it invariant to vector magnitude/length. Longer sentences with more repeated tokens might have large Euclidean distances while having identical semantic orientations.',
      },
    ],
    exercise: 'Given two normalized vectors of length 1, prove that Euclidean distance squared equals 2 - 2 * Cosine Similarity.',
    quiz: [
      {
        id: 'q14-1',
        question: 'If two normalized embedding vectors have a dot product of 1.0, what does it mean?',
        options: ['They are orthogonal (unrelated)', 'They are diametrically opposite in meaning', 'They are identical in direction (maximum similarity)', 'One vector has zero length'],
        correctAnswerIndex: 2,
        explanation: 'A cosine similarity (or dot product of unit vectors) of 1.0 represents collinear vectors pointing in the exact same direction.',
      },
    ],
  },
  {
    id: 15,
    title: '15. The Transformer Architecture',
    category: 'Deep Learning & LLMs',
    description: 'Introduced in "Attention Is All You Need" (Vaswani et al., 2017), the Transformer discarded recurrent sequential bottlenecks in favor of parallelized multi-head self-attention and positional encodings.',
    realWorldUse: 'The foundational architecture behind all modern AI: GPT-4, Gemini, Claude, LLaMA, Whisper, and Vision Transformers.',
    pythonCode: `# High-level components of a Transformer block
# 1. Input Tokens + Positional Encoding
# 2. Multi-Head Self-Attention (Query, Key, Value)
# 3. Add & LayerNorm (Residual connection)
# 4. Position-wise Feed-Forward Network (FFN)
# 5. Add & LayerNorm
print("Transformer Core Formula: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) * V")`,
    interviewQuestions: [
      {
        q: 'Why did Transformers replace Recurrent Neural Networks (RNNs and LSTMs)?',
        a: 'RNNs must process tokens sequentially step-by-step (O(n) time steps), preventing parallel training on GPUs and suffering from vanishing gradients across long contexts. Transformers compute attention across all tokens simultaneously in parallel.',
      },
    ],
    exercise: 'Explain the function of Positional Encoding in Transformers and why it is necessary.',
    quiz: [
      {
        id: 'q15-1',
        question: 'What is the primary computational benefit of Transformers over LSTMs during training?',
        options: ['Lower memory usage', 'Full parallelization of tokens across GPU tensor cores', 'No matrix multiplications', 'Requires no training data'],
        correctAnswerIndex: 1,
        explanation: 'Because Transformers do not process recurrently step-by-step, all sequence positions can be trained in parallel simultaneously.',
      },
    ],
  },
  {
    id: 16,
    title: '16. Attention Mechanisms & Self-Attention',
    category: 'Deep Learning & LLMs',
    description: 'Attention allows each token in a sentence to dynamically weigh and attend to every other token, calculating context-dependent representations (e.g. associating the pronoun "it" with "the dog" rather than "the street").',
    realWorldUse: 'Core attention engines in Gemini, BERT, GPT, and image attention models.',
    pythonCode: `import math

def scaled_dot_product_attention(q, k, v):
    # Simulated 1x2 vectors
    d_k = len(k)
    # Dot product Q and K
    score = sum(qi * ki for qi, ki in zip(q, k)) / math.sqrt(d_k)
    # Softmax weight (simplified scalar)
    weight = 1.0 / (1.0 + math.exp(-score))
    # Weighted V
    return [weight * vi for vi in v]

q = [1.0, 0.5]
k = [0.8, 0.6]
v = [2.0, 4.0]
print("Attended Value:", scaled_dot_product_attention(q, k, v))`,
    interviewQuestions: [
      {
        q: 'Why do we divide Q K^T by sqrt(d_k) in Scaled Dot-Product Attention?',
        a: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients (vanishing gradient problem). Dividing by sqrt(d_k) stabilizes variance to 1.',
      },
    ],
    exercise: 'Calculate attention scores between 3 words: "The", "bank", "robber".',
    quiz: [
      {
        id: 'q16-1',
        question: 'In self-attention, what are the three projection vectors created for each token?',
        options: ['Weights, Biases, Gradients', 'Query, Key, Value', 'Input, Hidden, Output', 'Encoder, Decoder, Attention'],
        correctAnswerIndex: 1,
        explanation: 'Each token representation is projected into Query (Q), Key (K), and Value (V) matrices.',
      },
    ],
  },
  {
    id: 17,
    title: '17. BERT & Bidirectional Contextual Encoders',
    category: 'Deep Learning & LLMs',
    description: 'BERT (Bidirectional Encoder Representations from Transformers) trains an encoder by masking 15% of tokens (Masked Language Modeling) to learn bidirectional context from both left and right simultaneously.',
    realWorldUse: 'Google Search query understanding, semantic similarity, classification, and question answering.',
    pythonCode: `# Understanding Masked Language Modeling (MLM)
original = "The interviewer evaluated the candidate during the mock round"
masked   = "The interviewer [MASK] the candidate during the mock round"
# BERT predicts probability distribution over vocabulary for [MASK]
print("MLM training task:", masked)`,
    interviewQuestions: [
      {
        q: 'How does BERT differ from auto-regressive models like GPT?',
        a: 'BERT is an encoder-only model that looks at both preceding and succeeding tokens simultaneously (bidirectional). GPT is a decoder-only model that uses causal masking to look only at past tokens to predict the next word.',
      },
    ],
    exercise: 'Explain the Next Sentence Prediction (NSP) auxiliary task used in original BERT training.',
    quiz: [
      {
        id: 'q17-1',
        question: 'Which token is prepended to every input sequence in BERT to serve as an aggregate classification token?',
        options: ['[SEP]', '[CLS]', '[MASK]', '[PAD]'],
        correctAnswerIndex: 1,
        explanation: 'The [CLS] token is the first token in every sequence, and its final hidden state is used for classification tasks.',
      },
    ],
  },
  {
    id: 18,
    title: '18. Large Language Models (LLMs) & Prompt Engineering',
    category: 'Deep Learning & LLMs',
    description: 'Decoder-only and mixture-of-experts architectures trained on trillions of tokens. Mastering few-shot prompting, chain-of-thought reasoning, system instructions, and temperature tuning.',
    realWorldUse: 'Gemini 3.8, interactive interview simulators, code generation, summarization, and autonomous AI agents.',
    pythonCode: `# Effective prompt engineering structure for AI Interviewer
system_prompt = """You are Ananya, a senior HR recruiter.
Evaluate candidate answers using the STAR methodology:
- Situation
- Task
- Action
- Result
Give constructive, high-impact feedback."""
print("System instruction configured for LLM.")`,
    interviewQuestions: [
      {
        q: 'What is Chain-of-Thought (CoT) prompting and why does it improve mathematical and reasoning performance in LLMs?',
        a: 'CoT prompts the model to generate intermediate step-by-step reasoning tokens before outputting the final answer. This allows the model to allocate more computation (transformer layers and token generations) to decompose the problem.',
      },
    ],
    exercise: 'Design a system prompt that enforces strict JSON output schema without markdown fences.',
    quiz: [
      {
        id: 'q18-1',
        question: 'What technique guides an LLM by providing 2 or 3 completed example demonstrations in the prompt?',
        options: ['Zero-shot prompting', 'Few-shot prompting', 'LoRA fine-tuning', 'Quantization'],
        correctAnswerIndex: 1,
        explanation: 'Few-shot prompting supplies example input-output pairs inside the prompt context to guide the format and style.',
      },
    ],
  },
  {
    id: 19,
    title: '19. Retrieval-Augmented Generation (RAG)',
    category: 'Applications',
    description: 'RAG combines external document retrieval (vector databases) with LLM generation to ground responses in fresh, private, and verified enterprise knowledge bases without retraining.',
    realWorldUse: 'Company handbook Q&A, coding documentation search, legal compliance assistants, customer support knowledge bases.',
    pythonCode: `# Conceptual RAG workflow
# 1. Ingestion: Document -> Chunking -> Embedding Model -> Vector DB
# 2. Retrieval: User Query -> Query Embedding -> Top K Chunks via Cosine Sim
# 3. Augmentation: Combine Context + User Question into Prompt
# 4. Generation: LLM answers grounded strictly in retrieved context.
rag_prompt = """Answer the question based strictly on the retrieved context below:
Context: [Candidates must demonstrate ACID compliance in relational queries.]
Question: How does the company evaluate database skills?"""
print("RAG Augmented prompt ready.")`,
    interviewQuestions: [
      {
        q: 'What are the main causes of hallucination in a RAG pipeline and how do you mitigate them?',
        a: 'Causes include bad chunking (cutting off crucial context), poor retrieval (low recall of relevant chunks), and LLM over-reliance on parametric memory. Mitigations: semantic chunking, hybrid search (dense + BM25), re-ranking (cross-encoders), and prompt guardrails.',
      },
    ],
    exercise: 'Explain the difference between dense retrieval (bi-encoders) and sparse retrieval (BM25).',
    quiz: [
      {
        id: 'q19-1',
        question: 'What component converts text chunks into searchable vectors in a RAG architecture?',
        options: ['Embedding Model', 'Tokenizer only', 'Vector Database Index only', 'Decoder only'],
        correctAnswerIndex: 0,
        explanation: 'An embedding model transforms text chunks into continuous dense semantic vectors.',
      },
    ],
  },
  {
    id: 20,
    title: '20. Practical NLP Projects & Production Deployment',
    category: 'Applications',
    description: 'Architecting end-to-end NLP systems: latency optimization, caching, streaming responses, quantization (INT4/INT8), evaluation frameworks (RAGAS, BLEU, ROUGE), and monitoring.',
    realWorldUse: 'Building production interview simulators, speech-to-speech translation systems, and enterprise LLM applications.',
    pythonCode: `# Streaming response and latency tracking in production NLP
import time

def simulate_llm_stream(tokens):
    start = time.time()
    first_token_time = None
    for i, token in enumerate(tokens):
        if i == 0:
            first_token_time = time.time() - start
        yield token
    print(f"Time to First Token (TTFT): {round(first_token_time * 1000, 1)}ms")

tokens = ["Great", "answer!", "Let's", "explore", "concurrency", "next."]
print("Streamed tokens:", list(simulate_llm_stream(tokens)))`,
    interviewQuestions: [
      {
        q: 'How do you measure generation quality in automated NLP evaluation?',
        a: 'Lexical metrics (BLEU, ROUGE, METEOR) for exact n-gram overlap; embedding metrics (BERTScore) for semantic similarity; and LLM-as-a-judge frameworks with rubric-based scoring.',
      },
    ],
    exercise: 'Design an end-to-end architecture diagram for a live voice-based interview assistant.',
    quiz: [
      {
        id: 'q20-1',
        question: 'Which metric measures the latency until the user sees the very first word generated by an LLM?',
        options: ['Throughput', 'Time To First Token (TTFT)', 'Inter-token latency', 'BLEU Score'],
        correctAnswerIndex: 1,
        explanation: 'Time To First Token (TTFT) measures initial response latency from prompt submission until the first token stream begins.',
      },
    ],
  },
];
