"use client";

import React, {useCallback, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import dayjs from "dayjs";
import {Group} from "@/app/(main)/(study)/groups/page";

export type GroupMember = {
  memberId: number;
  nickname: string;
};

const GroupsDetail = ({params}: { params: { id: number } }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [groupMember, setGroupMember] = useState<GroupMember[]>([]);
  const [comment, setComment] = useState('');

  const pathname = usePathname();
  const id = pathname.split('/').pop();

  const fetchGroup = async () => {
    try {
      const response = await fetch(`http://3.37.237.39:8080/api/v1/study/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data.data);
      } else {
        throw new Error('Failed to fetch the group data');
      }
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const fetchMember = useCallback(async () => {
    try {
      const response = await fetch(`http://3.37.237.39:8080/api/v1/member/${id}/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setGroupMember(data.data);
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (e) {
      console.error('Failed to fetch group member:', e);
    }
  }, []);

  useEffect(() => {
    fetchGroup();
    fetchMember();
  }, [id]);

  useEffect(() => {

  }, []);

  const studyJoin = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://3.37.237.39:8080/api/v1/study/join/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message ?? "스터디 참여 신청에 실패하였습니다.");
      }

      alert("스터디 참여 신청이 완료되었습니다.");
    } catch (error) {
      alert(error);
    }
  }, [id]);

  const addComment = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    if (!comment) return alert("댓글을 입력해 주세요");

    try {
      const response = await fetch(`http://3.37.237.39:8080/api/v1/study/comment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: comment,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "댓글 등록이 실패하였습니다.");
      }

    } catch (error) {
      console.error('Error fetching group:', error);
    }
  }, [comment, id]);


  if (!group) {
    return <p>Loading...</p>;
  }

  return (
    <div className="column w-full items-center">
      <div className="w-1/2">
        <h2 className="text-medium-56px text-neutral-700 mt-10">
          스터디 정보
        </h2>
        <div className="flex items-center justify-between py-2 border-b-neutral-400 border-b-2 gap-x-5 mt-20">
          <div className="flex items-center gap-x-2">
            <div className="px-2 py-0.5 text-medium-24px border-2 border-neutral-400 text-neutral-500 rounded-md">
              {group.studyStatus === "CURR" ? "모집중" : "진행중"}
            </div>
            <h3 className="text-semibold-36px text-neutral-800">
              {group.title}
            </h3>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="px-2 py-0.5 text-medium-24px border-2 border-neutral-400 text-neutral-500 rounded-md">
              {group.studyType === "OFFLINE" ? "오프라인" : "온라인"}
            </div>
            <div className="px-2 py-0.5 text-medium-24px border-2 border-neutral-400 text-neutral-500 rounded-md">
              서울, 강서
            </div>
            <div className="px-2 py-0.5 text-medium-24px border-2 border-neutral-400 text-neutral-500 rounded-md">
              {`${group.remainingNumber} | ${group.numberOfMembers} 명`}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full mt-5">
          <button
            className="bg-lime-400 p-5 rounded-md text-semibold-20px text-neutral-800 border border-lime-500 hover:bg-green-500"
            type="button"
            onClick={studyJoin}
          >
            스터디 참여하기
          </button>
        </div>

        <div className="grid grid-cols-5 gap-y-5 my-10 text-medium-18px">
          <div className="py-5">
            스터디장
          </div>
          <div className="col-span-4 flex items-center">
            {group.createdMember.nickname}
          </div>
          <div className="py-5">
            참여 스터디원
          </div>
          <div className="col-span-4 column justify-center">
            {groupMember.length ? groupMember.map((e) => (
              <span key={e.memberId}>
                {e.nickname}
              </span>
            )) : (
              <span>
                참여중인 스터디원이 없습니다.
              </span>
            )}
          </div>
          <div className="py-5">
            스터디 기간
          </div>
          <div className="col-span-4 flex items-center">
            {`${dayjs(group.dateStudyStart).format("YYYY.MM.DD")} - ${dayjs(group.dateStudyEnd).format("YYYY.MM.DD")}`}
          </div>
          <div className="py-5">
            스터디 정보
          </div>
          <div className="col-span-4 flex items-center bg-neutral-100 border border-neutral-200 px-8 py-10 rounded-md">
            <p className="text-medium-20px">
              {group.studyInfo}
            </p>
          </div>
        </div>

        <div className="column border-t border-neutral-400 p-5">
          <div className="flex items-center">
            <input
              className="w-full border-b border-b-neutral-300 p-2.5 my-5 focus:outline-none focus:border-b-neutral-800"
              placeholder="댓글 추가하기"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="w-20 py-2.5 bg-lime-400 rounded-2xl text-semibold-16px text-neutral-800 border border-lime-500 hover:bg-green-500"
              type={"button"}
              onClick={addComment}
            >
              댓글
            </button>
          </div>

          <div className="flex gap-x-5">
            <div className="p-2 text-semibold-16px text-neutral-600">
              닉네임
            </div>
            <div className="column">
              <div className="p-5 border border-lime-200 bg-lime-50 rounded-xl">
                이 스터디 정말 좋아요!
              </div>
              <div className="text-medium-12px flex items-end justify-end p-1">
                2024.05.06 05:00:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsDetail;
