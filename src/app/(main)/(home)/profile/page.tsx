"use client";

import React, {useCallback, useEffect, useState} from 'react'
import dayjs from "dayjs";

export type Profile = {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  gender: "M" | "F";
  birthdate: string;
  phone: string;
  introduce: string;
  temperature: number;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://3.37.237.39:8080/api/v1/member/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setProfile(data.data);
      } else {
        throw new Error('Failed to fetch the profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className={"w-full column"}>
      <div className="w-full flex items-center justify-between mt-10">
        <h1 className="text-semibold-36px text-neutral-600">
          <span className="text-lime-800">{"내 프로필"}</span>
        </h1>
      </div>

      <div className="grid grid-cols-5 gap-y-5 my-10 text-medium-18px">
        <div className="py-5">
          이메일
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.email}
        </div>
        <div className="py-5">
          이름
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.name}
        </div>
        <div className="py-5">
          닉네임
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.nickname}
        </div>
        <div className="py-5">
          성별
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.gender}
        </div>
        <div className="py-5">
          생일
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.birthdate}
        </div>
        <div className="py-5">
          전화번호
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.phone}
        </div>
        <div className="py-5">
          내 소개
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.introduce}
        </div>
        <div className="py-5">
          내 온도
        </div>
        <div className="col-span-4 flex items-center">
          {profile?.temperature}
        </div>
      </div>
    </div>
  )
}
export default ProfilePage
