import "server-only";

import {
  DemoOpsStatus,
  EnrollmentStatus,
  StudentProfileStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAdminOverviewData() {
  const [
    demoBookingCount,
    newDemoCount,
    studentCount,
    activeStudentCount,
    enrollmentCount,
    activeEnrollmentCount,
    attendanceCount,
    progressCount,
    recentDemoBookings,
    recentStudents,
  ] = await Promise.all([
    prisma.demoRequest.count(),
    prisma.demoRequest.count({ where: { opsStatus: DemoOpsStatus.NEW } }),
    prisma.portalProfile.count(),
    prisma.portalProfile.count({
      where: { status: StudentProfileStatus.ACTIVE },
    }),
    prisma.enrollment.count(),
    prisma.enrollment.count({
      where: { status: EnrollmentStatus.ACTIVE },
    }),
    prisma.attendance.count(),
    prisma.progress.count(),
    prisma.demoRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.portalProfile.findMany({
      include: {
        account: {
          select: {
            email: true,
            role: true,
          },
        },
        enrollments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    counts: {
      activeEnrollmentCount,
      activeStudentCount,
      attendanceCount,
      demoBookingCount,
      enrollmentCount,
      newDemoCount,
      progressCount,
      studentCount,
    },
    recentDemoBookings,
    recentStudents,
  };
}

export async function getDemoBookingsData(
  filter: DemoOpsStatus | "all" = "all",
) {
  const [demoBookings, counts] = await Promise.all([
    prisma.demoRequest.findMany({
      include: {
        profile: {
          select: {
            id: true,
            studentName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      where: filter === "all" ? undefined : { opsStatus: filter },
    }),
    Promise.all(
      [DemoOpsStatus.NEW, ...Object.values(DemoOpsStatus).filter((status) => status !== DemoOpsStatus.NEW)].map(
        async (status) => ({
          count: await prisma.demoRequest.count({ where: { opsStatus: status } }),
          status,
        }),
      ),
    ),
  ]);

  return {
    counts,
    demoBookings,
  };
}

export async function getStudentsData(
  filter: StudentProfileStatus | "all" = "all",
) {
  const profiles = await prisma.portalProfile.findMany({
    include: {
      account: {
        select: {
          email: true,
          role: true,
        },
      },
      enrollments: {
        orderBy: { createdAt: "desc" },
        take: 2,
      },
      teacherNotes: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    where: filter === "all" ? undefined : { status: filter },
  });

  const accountOptions = await prisma.portalAccount.findMany({
    orderBy: { email: "asc" },
    select: {
      email: true,
      id: true,
      profile: {
        select: { id: true },
      },
      role: true,
    },
    take: 200,
  });

  return {
    accountOptions,
    profiles,
  };
}

export async function getStudentDetailData(profileId: string) {
  const profile = await prisma.portalProfile.findUnique({
    include: {
      account: {
        select: {
          email: true,
          role: true,
        },
      },
      attendanceRecords: {
        orderBy: { classDate: "desc" },
        take: 12,
      },
      enrollments: {
        include: {
          payments: {
            orderBy: { createdAt: "desc" },
            take: 4,
          },
        },
        orderBy: { createdAt: "desc" },
      },
      progressRecords: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 12,
      },
      teacherNotes: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
    where: { id: profileId },
  });

  return profile;
}

export async function getEnrollmentsData(
  filter: EnrollmentStatus | "all" = "all",
) {
  const [enrollments, profileOptions] = await Promise.all([
    prisma.enrollment.findMany({
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        profile: {
          include: {
            account: {
              select: { email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      where: filter === "all" ? undefined : { status: filter },
    }),
    prisma.portalProfile.findMany({
      orderBy: { studentName: "asc" },
      select: {
        fullName: true,
        id: true,
        studentName: true,
      },
      take: 200,
    }),
  ]);

  return {
    enrollments,
    profileOptions,
  };
}

export async function getAttendanceData() {
  const [attendanceRecords, profileOptions] = await Promise.all([
    prisma.attendance.findMany({
      include: {
        enrollment: {
          select: {
            batchName: true,
            programName: true,
          },
        },
        profile: {
          select: {
            fullName: true,
            id: true,
            studentName: true,
          },
        },
      },
      orderBy: { classDate: "desc" },
      take: 100,
    }),
    prisma.portalProfile.findMany({
      include: {
        enrollments: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { studentName: "asc" },
      take: 200,
    }),
  ]);

  return {
    attendanceRecords,
    profileOptions,
  };
}

export async function getProgressData() {
  const [progressRecords, teacherNotes, profileOptions] = await Promise.all([
    prisma.progress.findMany({
      include: {
        enrollment: {
          select: {
            batchName: true,
            programName: true,
          },
        },
        profile: {
          select: {
            fullName: true,
            id: true,
            studentName: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 100,
    }),
    prisma.teacherNote.findMany({
      include: {
        enrollment: {
          select: {
            batchName: true,
            programName: true,
          },
        },
        profile: {
          select: {
            fullName: true,
            id: true,
            studentName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.portalProfile.findMany({
      include: {
        enrollments: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { studentName: "asc" },
      take: 200,
    }),
  ]);

  return {
    profileOptions,
    progressRecords,
    teacherNotes,
  };
}
