# -*- coding: utf-8 -*-
"""map.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1wSrit7mEH4T6NV_E-l75UGScpuLx-n5M
"""

import re
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# 인물 매핑 딕셔너리
person_mapping = {
    '임금': ['임금', '전하', '상감', '폐하', '과인'],
    '김류': ['김류', '영의정 김류', '영의정', '영상', '체찰사 김류', '체찰사'],
    '김상헌': ['김상헌', '예조판서 김상헌', '예판', '예판 김상헌 대감'],
    '최명길': ['최명길', '이조판서 최명길', '이판', '이판 최 대감'],
    '이시백': ['이시백', '수어사', '수어사 이시백'],
    '세자': ['세자', '동궁', '왕자'],
    '용골대': ['용골대', '청장 용골대'],
    '정명수': ['정명수', '천례 정명수', '정대인'],
    '서날쇠': ['서날쇠', '대장장이 서날쇠'],
    '칸': ['칸', '황제', '천자', '만승']
}

def preprocess_text(text):
    lines = text.split('\n')
    han_pattern = r'[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\uF900-\uFAFF\u2F800-\u2FA1F]'
    lines = [re.sub(han_pattern, '', line) for line in lines]
    lines = [re.sub(r'[a-zA-Z]', '', line) for line in lines]
    text = '\n'.join(lines)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[^\w\s\.\,\!\?\-]', '', text)
    return text

def replace_names(text):
    for person, aliases in person_mapping.items():
        for alias in sorted(aliases, key=len, reverse=True):
            pattern = r'(?<!\<PS\>)(?:\S+\s+)?(?:' + '|'.join(re.escape(a) for a in aliases) + r')(?!\<\/PS\>)'
            text = re.sub(pattern, f'<PS>{person}</PS>', text)
    return text

def tag_entities(text, model_path):
    text = preprocess_text(text)  # 전처리 단계 추가
    text = replace_names(text)  # 인물 이름 매핑 추가
    model = AutoModelForTokenClassification.from_pretrained(model_path, local_files_only=True)
    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
    ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer)

    sentences = re.split(r'(?<=[.?!])\s+', text)
    tagged_sentences = []

    for sentence in sentences:
        results = ner_pipeline(sentence)
        merged_entities = []
        temp_entity, temp_tokens = "", []

        for result in results:
            entity, word = result['entity'], result['word']

            if entity.startswith("B-"):
                if temp_entity:
                    merged_entities.append((temp_entity, tokenizer.convert_tokens_to_string(temp_tokens)))
                temp_entity, temp_tokens = entity[2:], [word]
            elif entity.startswith("I-") and entity[2:] == temp_entity:
                temp_tokens.append(word)
            else:
                if temp_entity:
                    merged_entities.append((temp_entity, tokenizer.convert_tokens_to_string(temp_tokens)))
                temp_entity, temp_tokens = "", []
        if temp_entity:
            merged_entities.append((temp_entity, tokenizer.convert_tokens_to_string(temp_tokens)))

        for entity, word in merged_entities:
            sentence = re.sub(rf"<({entity})>.*?</\1>", word, sentence)  # Remove existing tags
            sentence = sentence.replace(word, f"<{entity}>{word}</{entity}>")
        tagged_sentences.append(sentence.strip())

    return '\n'.join(tagged_sentences)

def run_ner_tagging():
    input_file = "/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/남한산성 태라버전/Section0000.txt"
    output_file = "/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/tagged_sentences.txt"
    model_path = "/content/drive/MyDrive/영원한자연어처리6조_코드/backbone/model/roberta_남한산성_epoch8/checkpoint-1008"

    with open(input_file, 'r', encoding='utf-8') as file:
        text = file.read()

    tagged_text = tag_entities(text, model_path)

    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(tagged_text)

    print(f"Tagged text saved to {output_file}")

if __name__ == "__main__":
    run_ner_tagging()

import pandas as pd
import re
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# 텍스트 파일에서 데이터를 읽고 DataFrame 생성

file_path = "/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/tagged_sentences.txt"

# 텍스트 파일 읽기
with open(file_path, 'r', encoding='utf-8') as file:
    text = file.read()

# 텍스트를 문장 단위로 나누기
sentences = re.split(r'(?<=[.?!])\s+', text)

# JSON 파일에서 인물 목록 불러오기
json_path = '/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/output.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
    # "top_20_persons"에서 인물 이름 추출
    keywords = [person[0] for person in data.get("top_20_persons", [])]

# 문장 데이터로 DataFrame 생성
df = pd.DataFrame({'sent_form': sentences})

# 특정 단어들을 포함하는 문장 필터링 함수 정의
def filter_sentences_by_keywords(df, keywords):
    pattern = '|'.join(re.escape(keyword) for keyword in keywords)  # 키워드를 OR 조건으로 결합
    filtered_sentences = df['sent_form'][df['sent_form'].str.contains(pattern, na=False)]
    return '\n'.join(filtered_sentences.str.strip())  # 줄바꿈 및 양쪽 공백 제거

# 이동 여부 예측을 위한 모델 및 토크나이저 로드
model_path = '/content/drive/MyDrive/영원한자연어처리6조_코드/trained_models/relation_extraction_model_class'
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

def predict_movement(sentence):
    persons, locations = extract_entities(sentence)
    predictions = []
    if not persons or not locations:
        return predictions
    for person in persons:
        for location in locations:
            marked_sentence = sentence
            marked_sentence = marked_sentence.replace(f'<PS>{person}</PS>', f'[E1] {person} [/E1]')
            marked_sentence = marked_sentence.replace(f'<LC>{location}</LC>', f'[E2] {location} [/E2]')
            marked_sentence = re.sub(r'</?PS>', '', marked_sentence)
            marked_sentence = re.sub(r'</?LC>', '', marked_sentence)
            inputs = tokenizer(
                marked_sentence,
                return_tensors='pt',
                padding='max_length',
                truncation=True,
                max_length=128
            )
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            inputs = {key: value.to(device) for key, value in inputs.items()}
            model.to(device)
            outputs = model(**inputs)
            logits = outputs.logits
            pred = torch.argmax(logits, dim=1).item()
            if pred == 1:
                predictions.append((person, location))
    return predictions

def extract_entities(sentence):
    persons = re.findall(r'<PS>(.*?)</PS>', sentence)
    locations = re.findall(r'<LC>(.*?)</LC>', sentence)
    return persons, locations

def extract_location_sentences_with_movement(sentences):
    location_sentences = []
    pattern = r'(<LC>(.*?)</LC>.*?\.)'

    for sentence in sentences:
        predictions = predict_movement(sentence)
        if predictions:
            match = re.search(pattern, sentence)
            if match:
                location = match.group(2)  # LC 태그 내부의 장소
                clean_sentence = re.sub(r'<.*?>', '', sentence)  # 태그 제거
                location_sentences.append({location: clean_sentence})

    return location_sentences

# 이동 여부가 있는 문장만 추출
location_sentences = extract_location_sentences_with_movement(sentences)

# 장소별 문장 결과 출력
for entry in location_sentences:
    for location, sentence in entry.items():
        print(f"{location}: {sentence}")

# 결과를 파일로 저장 (옵션)
output_path = '/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/location_sentences.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(location_sentences, f, ensure_ascii=False, indent=4)

import json

# 기존 JSON 파일 로드
input_path = '/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/location_sentences.json'
with open(input_path, 'r', encoding='utf-8') as f:
    location_sentences = json.load(f)

# 불필요한 장소명을 포함하는 데이터 삭제 함수 정의
def remove_non_specific_places(location_sentences, non_specific_places):
    filtered_sentences = [
        entry for entry in location_sentences
        if not any(place in entry for place in non_specific_places)
    ]
    return filtered_sentences

# 불필요한 장소명 목록
non_specific_places = [
    "방바닥", "언 강", "산악", "산중", "성벽 밖 골짜기",
    "조선의 성 안", "삼거리 대로변", "성벽 길", "강 상류", "조선의 강", "송파강", "산 뒤",
    "삼전도 쪽 들판", "능선 길", "지방관아", "검단산 남쪽 기슭", "언덕길",
    "북장대 쪽 성벽", "방문", "동문 밖", "도성 안 경창", "낙동강", "성 밖 봉우리", "북쪽 성벽",
    "망월봉 뒷면 도로", "성 밖 산길", "명의 변방 요새", "서쪽 성벽", "민촌의 마당",
    "성 안 무기고", "강토", "산성 쪽 고지", "지방 군장들의 군영",
    "강 건너", "서장대 뒤 성벽", "성 밑", "성벽 밑", "장대 마당", "성 안 삼거리", "동문 아래 암문",
    "북장대 마당", "사찰 마당", "질청 마당", "강화성", "북문 안", "조선 백성들의 가옥", "산천",
    "성 안 오리나무 숲", "압록 강", "동쪽 성벽", "순청 마당", "성 밖 개울가", "옹성",
    "행궁 뒷담 길", "황제의 일산", "산성 안", "행각 골방", "사당 마당", "남문 앞 들판",
    "북한산", "방 한 칸", "개성", "서문 앞", "동문 안 민촌", "방 안", "성 안 개울", "북방",
    "성 안 농토", "명의 변방", "야산", "뒷마당", "한강", "옹성 앞", "성 밖", "둑길",
    "대동강", "인근 고을", "성의 서북 방면 매복 진지", "서장대 뒤쪽의 빈 성첩",
    "토성 진지", "동쪽 성문", "삼각산", "안시성", "남쪽 성벽", "인근 산악", "남문 앞",
    "내행전 앞마당", "구비 길", "북문 밖", "성 안의 농경지", "강나루",
    "성 안 ", "행궁 뒷길", "행각 구석방", "성벽 안쪽", "산성 서문", "길목", "산골",
    "남문 안 비탈", "성 안", "군막 앞마당", "군진 마당", "들판 가장자리",
    "남벽 성첩", "온돌방", "방 밖", "대장간 마당", "행궁 마당", "마당 안쪽", "성 밖 고지",
    "행궁 뒷담길", "조선의 산성", "길 위", "성 안 사찰", "산성 마을", "강화행궁", "강화도",
    "골짜기 아래", "성벽 밖 고지", "북장대 쪽 성첩", "남한산성 성벽", "은산 고을과 관아",
    "양평 산악", "길가", "남문 문루 위", "성 밖 산봉우리", "안방", "산 밑", "강가",
    "귀국의 대궐", "산길의 중턱", "종실들 처소", "성첩 위", "샛길", "최명길의 방", "죽산",
    "강줄기", "남도의 산맥", "침소 방바닥", "경기 지역 고을", "남한산성 서문", "순천 마당",
    "동쪽 성벽 밑", "성 안 조선 군병", "성 안의 길", "서문 밖", "동문 앞", "삼전도 들판",
    "오산", "남한산성의 성벽", "경강", "행궁 앞마당", "산성", "성 안 마을", "거여·마천의 넓은 들",
    "북문 문루 위", "행궁 쪽 산길", "서북 성벽", "성 밖 들", "인왕산", "순청 앞마당",
    "강가의 너른 들", "옹성 ", "남동 성첩", "성 안쪽", "너와집 앞마당", "거여·마천의 들",
    "산성 외곽", "북문 문루", "강 하류", "성 밖 세상", "강화산성", "대궐 밖", "길섶",
    "한강 유역의 조창", "송파나루 언 강", "남한산성 북쪽 외곽 산악", "남한산성의 조선 행궁",
    "도성 안", "산모퉁이", "산 위", "성문 밖", "성 안의 관아", "변방 요새", "임진강",
    "삼전도 송파강", "남장대 마당", "얼음길", "물길", "야산 모퉁이", "북장대 쪽 골짜기",
    "행전 마당", "말길", "소방", "성 밖의 길", "서날쇠의 마당", "북경의 황성", "남한산성 행궁",
    "도성 안의 경창", "서장대 마당", "동문 쪽 산", "강가 마을", "개울 너머 산", "한 칸 방",
    "남문 밖", "이배재 고갯길", "한강 유역", "들판", "대로"
]

# 불필요한 장소명 제거
filtered_location_sentences = remove_non_specific_places(location_sentences, non_specific_places)

# 필터링된 데이터 저장
output_filtered_path = '/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/location_sentences.json'
with open(output_filtered_path, 'w', encoding='utf-8') as f:
    json.dump(filtered_location_sentences, f, ensure_ascii=False, indent=4)

# 결과 확인용 출력 (옵션)
for entry in filtered_location_sentences:
    for location, sentence in entry.items():
        print(f"{location}: {sentence}")

import json
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from geopy.geocoders import Nominatim
from geopy.distance import great_circle

output_path = '/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/location_sentences.json'
model_path = "/content/drive/MyDrive/영원한자연어처리6조_코드/backbone/model/roberta_남한산성_epoch8/checkpoint-1008"

# 모델과 토크나이저 로드 함수
def load_model(model_path):
    model = AutoModel.from_pretrained(model_path, local_files_only=True)
    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
    return model, tokenizer

# 문장 임베딩 추출 함수
def get_sentence_embedding(text, model, tokenizer):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    embedding = outputs.last_hidden_state[:, 0, :].numpy()
    return embedding

# 지리적 근접성 계산 함수
def calculate_geographical_proximity(candidate_location, previous_locations):
    if not previous_locations:
        return 0  # 이전 위치가 없으면 근접성 0
    distances = []
    for prev_loc in previous_locations:
        prev_point = (prev_loc['latitude'], prev_loc['longitude'])
        cand_point = (candidate_location.latitude, candidate_location.longitude)
        distance = great_circle(prev_point, cand_point).kilometers
        distances.append(distance)
    avg_distance = sum(distances) / len(distances)
    # 거리가 가까울수록 근접성 점수가 높아지도록 (역수 사용)
    proximity_score = 1 / (avg_distance + 1)
    return proximity_score

def select_locations(json_path, n_geo_locations=5, n_candidate_locations=5, alpha=0.7, model_path=None):
    if model_path is None:
        raise ValueError("모델 경로를 지정해야 합니다.")

    # 모델 로드
    model, tokenizer = load_model(model_path)
    geolocator = Nominatim(user_agent="geo_example")

    # JSON 파일 로드
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    previous_locations = []
    final_dict = {}

    # data는 [{"장소명":"문장"}, {"장소명":"문장"}, ...] 형태라고 가정
    for item in data:
        for place_name, sentence in item.items():
            # 해당 장소명에 대한 문장 임베딩
            sentence_embedding = get_sentence_embedding(sentence, model, tokenizer)

            # 지오코딩 후보 위치 가져오기
            locations = geolocator.geocode(place_name, exactly_one=False, limit=n_candidate_locations)

            if locations:
                candidate_scores = []
                for loc in locations:
                    # 후보 주소와 지명을 합쳐서 임베딩
                    loc_description = loc.address + ' ' + place_name
                    loc_embedding = get_sentence_embedding(loc_description, model, tokenizer)

                    # 코사인 유사도
                    similarity = cosine_similarity(sentence_embedding, loc_embedding)[0][0]

                    # 지리적 근접성
                    recent_previous_locations = previous_locations[-n_geo_locations:]
                    proximity_score = calculate_geographical_proximity(loc, recent_previous_locations)

                    # 종합 스코어
                    total_score = (similarity * alpha) + (proximity_score * (1 - alpha))
                    candidate_scores.append((total_score, loc))

                # 가장 스코어 높은 후보 선택
                best_match = max(candidate_scores, key=lambda x: x[0])
                selected_location = best_match[1]

                # 선택한 장소 정보 저장
                location_info = {
                    'name': place_name,
                    'latitude': selected_location.latitude,
                    'longitude': selected_location.longitude,
                    'address': selected_location.address
                }
                previous_locations.append(location_info)

                # 최종 딕셔너리에 추가
                final_dict[place_name] = (selected_location.latitude, selected_location.longitude)

                # previous_locations 길이 제한
                if len(previous_locations) > n_geo_locations:
                    previous_locations = previous_locations[-n_geo_locations:]
            else:
                print(f"{place_name}의 좌표를 찾을 수 없습니다.")

    return final_dict

# 함수 호출 예시
selected_dict = select_locations(
    json_path=output_path,
    n_geo_locations=5,
    n_candidate_locations=5,
    alpha=0.7,
    model_path=model_path
)

print("\n최종 선택된 위치들:")
print(selected_dict)


# 최종 결과를 JSON 파일에 저장
output_file = '/content/drive/MyDrive/영원한자연어처리6조_코드/Clustering/selected_locations.json'  # 저장할 파일 경로

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(selected_dict, f, ensure_ascii=False, indent=4)

print(f"\n최종 선택된 위치들이 {output_file}에 저장되었습니다.")

